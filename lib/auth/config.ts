import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { safePrismaQuery } from "@/lib/prisma";
import prisma from "@/lib/db/prisma";
import {
  checkRateLimit,
  recordFailedLogin,
  clearLoginAttempts,
  getClientIP,
} from "@/lib/auth/security";

/**
 * NextAuth configuration (admin credentials login).
 *
 * Security notes:
 * - Login attempts are limited per IP *and* per email (blocks credential
 *   stuffing from many IPs against one account).
 * - A dummy bcrypt comparison runs when the email does not exist, so response
 *   timing does not reveal which emails are admins.
 * - Every time a session is read, the JWT callback re-checks the admin in the
 *   database (cached for 60s). Disabled/deleted admins lose access immediately,
 *   and a token forged with a leaked NEXTAUTH_SECRET is rejected unless it
 *   matches a real, ACTIVE admin's id and email.
 * - Sessions last 8 hours instead of 30 days.
 */

// bcrypt hash of a random string; only used to equalise timing.
const DUMMY_HASH = "***REMOVED_HASH***";

const SESSION_MAX_AGE = 8 * 60 * 60; // 8 hours
const VERIFY_CACHE_MS = 60 * 1000;
const verifiedAdmins = new Map<string, number>(); // `${id}:${email}` -> verifiedAt

async function isActiveAdmin(id: string, email: string): Promise<boolean> {
  const key = `${id}:${email}`;
  const cachedAt = verifiedAdmins.get(key);
  if (cachedAt && Date.now() - cachedAt < VERIFY_CACHE_MS) return true;

  const admin = await prisma.admin.findUnique({
    where: { id },
    select: { email: true, status: true },
  });

  const ok = !!admin && admin.status === "ACTIVE" && admin.email === email;
  if (ok) verifiedAdmins.set(key, Date.now());
  else verifiedAdmins.delete(key);
  return ok;
}

function headersFrom(req: unknown): Headers {
  const raw = (req as { headers?: Record<string, string | string[] | undefined> })?.headers;
  const headers = new Headers();
  if (raw) {
    for (const [k, v] of Object.entries(raw)) {
      if (typeof v === "string") headers.set(k, v);
      else if (Array.isArray(v)) headers.set(k, v.join(","));
    }
  }
  return headers;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const ip = getClientIP(headersFrom(req)) || "unknown";
        const email = (credentials?.email || "").trim().toLowerCase().slice(0, 255);
        const password = credentials?.password || "";

        const ipKey = `ip:${ip}`;
        const emailKey = `email:${email}`;

        if (!checkRateLimit(ipKey).allowed || (email && !checkRateLimit(emailKey).allowed)) {
          console.warn("[AUTH] Login rate limit exceeded");
          throw new Error("Too many login attempts. Please try again later.");
        }

        const fail = () => {
          recordFailedLogin(ipKey);
          if (email) recordFailedLogin(emailKey);
          return null;
        };

        if (!email || !password || password.length > 200) return fail();

        try {
          const admin = await safePrismaQuery(
            (client) =>
              client.admin.findUnique({
                where: { email },
                select: { id: true, email: true, name: true, passwordHash: true, status: true },
              }),
            3
          );

          // Always run bcrypt so timing is the same whether or not the user exists.
          const passwordOk = await compare(password, admin?.passwordHash || DUMMY_HASH);

          if (!admin || !passwordOk || admin.status !== "ACTIVE") {
            console.warn("[AUTH] Failed login attempt");
            return fail();
          }

          clearLoginAttempts(ipKey);
          clearLoginAttempts(emailKey);

          prisma.admin
            .update({ where: { id: admin.id }, data: { lastLoginAt: new Date() } })
            .catch((err) => console.error("[AUTH] Update last login failed:", err.message));

          prisma.auditLog
            .create({
              data: {
                adminId: admin.id,
                action: "ADMIN_LOGIN",
                resource: "Admin",
                resourceId: admin.id,
                result: "SUCCESS",
                ipAddress: ip,
              },
            })
            .catch((err) => console.error("[AUTH] Audit log failed:", err.message));

          return { id: admin.id, email: admin.email, name: admin.name };
        } catch (error) {
          console.error("[AUTH] Login error:", error instanceof Error ? error.message : String(error));
          return fail();
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        return token;
      }

      // Re-validate on every session read. Throwing makes next-auth drop the
      // session and clear the cookie.
      const id = token.id as string | undefined;
      const email = token.email as string | undefined;
      if (!id || !email || !(await isActiveAdmin(id, email))) {
        throw new Error("Session no longer valid");
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin-login",
    error: "/admin-login",
  },
  session: {
    strategy: "jwt",
    maxAge: SESSION_MAX_AGE,
    updateAge: 60 * 60,
  },
  jwt: {
    maxAge: SESSION_MAX_AGE,
  },
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-next-auth.session-token"
          : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: false,
};

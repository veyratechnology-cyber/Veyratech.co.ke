"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CalendarCheck,
  Check,
  Clock,
  CreditCard,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Send,
  ShieldCheck,
  Video,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/shared";
import { INDUSTRIES, CONSULTATION_TYPES } from "@/lib/constants";

/**
 * Consultation booking: 4 short steps with per-step validation.
 * Posts to /api/consultations (validated, rate-limited, creates a lead).
 * Answers are kept in sessionStorage so a refresh doesn't lose them.
 */

type MeetingType = "GOOGLE_MEET" | "PHONE" | "IN_PERSON";

interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  industry: string;
  businessChallenge: string;
  consultationTypes: string[];
  meetingType: MeetingType;
  preferredDate: string;
  preferredTime: string;
}

const EMPTY: FormData = {
  name: "",
  email: "",
  phone: "",
  company: "",
  industry: "",
  businessChallenge: "",
  consultationTypes: [],
  meetingType: "GOOGLE_MEET",
  preferredDate: "",
  preferredTime: "",
};

const PRICE = "KSH 15,000";
const DRAFT_KEY = "veyratech-booking-draft";

const STEPS = [
  { id: 1, title: "Your details" },
  { id: 2, title: "Your needs" },
  { id: 3, title: "Date & time" },
  { id: 4, title: "Review" },
] as const;

const MEETING_OPTIONS: { value: MeetingType; label: string; hint: string; icon: typeof Video }[] = [
  { value: "GOOGLE_MEET", label: "Google Meet", hint: "Video call link by email", icon: Video },
  { value: "PHONE", label: "Phone call", hint: "We call your number", icon: Phone },
  { value: "IN_PERSON", label: "In person", hint: "We agree a location", icon: MapPin },
];

const TIME_SLOTS = ["08:00", "09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"];

const fieldClass =
  "w-full rounded-xl border bg-primary-dark px-4 py-3 text-[15px] text-white placeholder:text-text-muted/50 transition-colors focus:outline-none focus:ring-2 focus:ring-secondary/40";

const todayISO = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
};

function formatDate(iso: string) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

function formatTime(t: string) {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${h < 12 ? "am" : "pm"}`;
}

/** Validation mirrors the server rules in /api/consultations. */
function validateStep(step: number, f: FormData): Record<string, string> {
  const e: Record<string, string> = {};
  if (step === 1) {
    if (f.name.trim().length < 2) e.name = "Please enter your full name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) e.email = "Enter a valid email address";
    const digits = f.phone.replace(/\D/g, "").length;
    if (!/^\+?[0-9][0-9\s()-]*$/.test(f.phone.trim()) || digits < 7 || digits > 15) e.phone = "Enter a valid phone number, e.g. 0712 345 678";
  }
  if (step === 2) {
    const len = f.businessChallenge.trim().length;
    if (len < 10) e.businessChallenge = "Tell us a little more (at least 10 characters)";
    if (len > 2000) e.businessChallenge = "Please keep this under 2,000 characters";
    if (f.consultationTypes.length > 5) e.consultationTypes = "Choose up to 5 areas";
  }
  if (step === 3) {
    if (f.preferredDate && f.preferredDate < todayISO()) e.preferredDate = "Choose today or a later date";
    if (f.preferredTime && !f.preferredDate) e.preferredDate = "Choose a date for this time";
  }
  return e;
}

export default function SimpleBooking() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [customTime, setCustomTime] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const loaded = useRef(false);

  // Restore a saved draft (same browser tab), then keep it updated
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(DRAFT_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved && typeof saved === "object") {
          setForm({ ...EMPTY, ...saved, consultationTypes: Array.isArray(saved.consultationTypes) ? saved.consultationTypes : [] });
          if (saved.preferredTime && !TIME_SLOTS.includes(saved.preferredTime)) setCustomTime(true);
        }
      }
    } catch {
      /* storage unavailable: carry on without a draft */
    }
    loaded.current = true;
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    try {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(form));
    } catch {
      /* ignore */
    }
  }, [form]);

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const toggleType = (value: string) =>
    set(
      "consultationTypes",
      form.consultationTypes.includes(value) ? form.consultationTypes.filter((t) => t !== value) : [...form.consultationTypes, value]
    );

  const goTo = (next: number) => {
    setStep(next);
    setSubmitError(null);
    requestAnimationFrame(() => {
      cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      headingRef.current?.focus({ preventScroll: true });
    });
  };

  const handleNext = () => {
    const found = validateStep(step, form);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      document.getElementById(`booking-${first}`)?.focus();
      return;
    }
    goTo(step + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 4) return handleNext();
    if (isSubmitting || !acceptedTerms) return;

    // Re-check everything in case a draft was edited
    for (const s of [1, 2, 3]) {
      const found = validateStep(s, form);
      if (Object.keys(found).length) {
        setErrors(found);
        return goTo(s);
      }
    }

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const response = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim() }),
      });
      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        try {
          sessionStorage.removeItem(DRAFT_KEY);
        } catch {
          /* ignore */
        }
        router.push(`/book-consultation/success?id=${data.id}`);
        return;
      }

      if (response.status === 429) {
        throw new Error("You've made several booking attempts in a short time. Please wait a few minutes and try again, or call us.");
      }
      if (Array.isArray(data.details) && data.details.length) {
        throw new Error(`Please check: ${data.details.map((d: { message?: string }) => d.message).filter(Boolean).join(", ")}`);
      }
      throw new Error(data.error || "We couldn't submit your booking.");
    } catch (error: any) {
      setSubmitError(error?.message || "Something went wrong. Please try again or call us on +254 745 247 211.");
      setIsSubmitting(false);
      cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const meeting = MEETING_OPTIONS.find((m) => m.value === form.meetingType)!;
  const interests = useMemo(
    () => CONSULTATION_TYPES.filter((t) => form.consultationTypes.includes(t.value)).map((t) => t.label),
    [form.consultationTypes]
  );
  const whenText = form.preferredDate
    ? `${formatDate(form.preferredDate)}${form.preferredTime ? ` at ${formatTime(form.preferredTime)}` : ""}`
    : "We'll suggest a time";

  const err = (name: string) =>
    errors[name] ? (
      <p id={`booking-${name}-error`} className="mt-1.5 flex items-center gap-1.5 text-sm text-red-300">
        <AlertCircle size={14} aria-hidden="true" /> {errors[name]}
      </p>
    ) : null;

  const inputProps = (name: keyof FormData) => ({
    id: `booking-${name}`,
    "aria-invalid": !!errors[name] || undefined,
    "aria-describedby": errors[name] ? `booking-${name}-error` : undefined,
    className: `${fieldClass} ${errors[name] ? "border-red-400/70" : "border-white/10 focus:border-secondary"}`,
  });

  return (
    <>
      {/* Intro */}
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="pointer-events-none absolute inset-0 bg-glow" aria-hidden="true" />
        <div className="container-custom relative py-12 md:py-16">
          <div className="mx-auto max-w-3xl text-center">
            <span className="eyebrow">
              <CalendarCheck size={14} aria-hidden="true" /> Book a consultation
            </span>
            <h1 className="mt-5 text-4xl font-bold md:text-5xl">Book your consultation</h1>
            <p className="mt-4 text-lg text-text-secondary/90">
              A focused 60-minute session with our team about your business challenge. It takes about 2 minutes to book.
            </p>
            <ul className="mt-7 flex flex-wrap justify-center gap-3 text-sm">
              {[
                { icon: Clock, text: "60 minutes" },
                { icon: CreditCard, text: `${PRICE} (excl. VAT)` },
                { icon: ShieldCheck, text: "Pay only after we confirm" },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-text-primary">
                  <Icon size={16} className="text-secondary" aria-hidden="true" /> {text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section pt-10 md:pt-14">
        <div className="container-custom">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_340px]">
            {/* Form */}
            <div ref={cardRef} className="scroll-mt-24">
              {/* Progress */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-sm sm:hidden">
                  <span className="font-semibold text-text-primary">
                    Step {step} of {STEPS.length}: {STEPS[step - 1].title}
                  </span>
                </div>
                <ol className="hidden items-center sm:flex">
                  {STEPS.map((s, i) => {
                    const done = step > s.id;
                    const current = step === s.id;
                    return (
                      <li key={s.id} className="flex flex-1 items-center last:flex-none">
                        <button
                          type="button"
                          onClick={() => done && goTo(s.id)}
                          disabled={!done}
                          aria-current={current ? "step" : undefined}
                          className="flex items-center gap-2.5 disabled:cursor-default"
                        >
                          <span
                            className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors ${
                              done ? "border-secondary bg-secondary text-white" : current ? "border-secondary bg-secondary/10 text-secondary" : "border-white/15 text-text-muted"
                            }`}
                          >
                            {done ? <Check size={18} aria-hidden="true" /> : s.id}
                          </span>
                          <span className={`text-sm font-medium ${current || done ? "text-text-primary" : "text-text-muted"}`}>{s.title}</span>
                        </button>
                        {i < STEPS.length - 1 && <span className={`mx-4 h-0.5 flex-1 rounded ${done ? "bg-secondary" : "bg-white/10"}`} aria-hidden="true" />}
                      </li>
                    );
                  })}
                </ol>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10 sm:hidden" aria-hidden="true">
                  <div className="h-full rounded-full bg-secondary transition-all duration-300" style={{ width: `${(step / STEPS.length) * 100}%` }} />
                </div>
              </div>

              {submitError && (
                <div role="alert" className="mb-6 flex items-start gap-3 rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-200">
                  <AlertCircle size={18} className="mt-0.5 flex-shrink-0" aria-hidden="true" />
                  <span>{submitError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="rounded-3xl border border-white/10 bg-primary-dark/60 p-6 md:p-9">
                <h2 ref={headingRef} tabIndex={-1} className="text-2xl focus:outline-none">
                  {step === 1 && "Your details"}
                  {step === 2 && "What can we help you with?"}
                  {step === 3 && "When would you like to meet?"}
                  {step === 4 && "Review and confirm"}
                </h2>
                <p className="mt-1.5 text-sm text-text-muted">
                  {step === 1 && "So we know who to contact about your booking."}
                  {step === 2 && "A few lines is enough. It helps us come prepared."}
                  {step === 3 && "Optional. If you skip this, we'll suggest a time by email."}
                  {step === 4 && "Check your details before you confirm."}
                </p>

                <div className="mt-7 animate-fadeIn" key={step}>
                  {/* STEP 1 */}
                  {step === 1 && (
                    <div className="grid gap-5 md:grid-cols-2">
                      <div>
                        <label htmlFor="booking-name" className="mb-1.5 block text-sm font-medium text-text-secondary">Full name <span className="text-secondary">*</span></label>
                        <input {...inputProps("name")} autoComplete="name" maxLength={100} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Jane Wanjiku" />
                        {err("name")}
                      </div>
                      <div>
                        <label htmlFor="booking-email" className="mb-1.5 block text-sm font-medium text-text-secondary">Email address <span className="text-secondary">*</span></label>
                        <input {...inputProps("email")} type="email" inputMode="email" autoComplete="email" maxLength={255} value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="jane@company.co.ke" />
                        {err("email") || <p className="mt-1.5 text-xs text-text-muted/70">Your confirmation and invoice go here.</p>}
                      </div>
                      <div>
                        <label htmlFor="booking-phone" className="mb-1.5 block text-sm font-medium text-text-secondary">Phone number <span className="text-secondary">*</span></label>
                        <input {...inputProps("phone")} type="tel" inputMode="tel" autoComplete="tel" maxLength={20} value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="0712 345 678" />
                        {err("phone")}
                      </div>
                      <div>
                        <label htmlFor="booking-company" className="mb-1.5 block text-sm font-medium text-text-secondary">Company <span className="text-text-muted/60">(optional)</span></label>
                        <input {...inputProps("company")} autoComplete="organization" maxLength={200} value={form.company} onChange={(e) => set("company", e.target.value)} placeholder="Your Company Ltd" />
                      </div>
                    </div>
                  )}

                  {/* STEP 2 */}
                  {step === 2 && (
                    <div className="space-y-6">
                      <div>
                        <label htmlFor="booking-businessChallenge" className="mb-1.5 block text-sm font-medium text-text-secondary">
                          What&apos;s your main challenge? <span className="text-secondary">*</span>
                        </label>
                        <textarea
                          {...inputProps("businessChallenge")}
                          rows={5}
                          maxLength={2000}
                          value={form.businessChallenge}
                          onChange={(e) => set("businessChallenge", e.target.value)}
                          placeholder="For example: we track stock in Excel and it never matches what's in the shop…"
                        />
                        <div className="flex items-start justify-between gap-3">
                          <div>{err("businessChallenge")}</div>
                          <p className="mt-1.5 flex-shrink-0 text-xs text-text-muted/60">{form.businessChallenge.length}/2000</p>
                        </div>
                      </div>

                      <fieldset>
                        <legend className="mb-2.5 text-sm font-medium text-text-secondary">
                          Areas of interest <span className="text-text-muted/60">(optional, up to 5)</span>
                        </legend>
                        <div className="flex flex-wrap gap-2">
                          {CONSULTATION_TYPES.slice(0, 8).map((type) => {
                            const active = form.consultationTypes.includes(type.value);
                            return (
                              <button
                                key={type.value}
                                type="button"
                                aria-pressed={active}
                                onClick={() => toggleType(type.value)}
                                className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                                  active ? "border-secondary bg-secondary/15 font-semibold text-secondary" : "border-white/15 text-text-secondary hover:border-secondary/50"
                                }`}
                              >
                                {active && <Check size={14} className="-mt-0.5 mr-1 inline" aria-hidden="true" />}
                                {type.label}
                              </button>
                            );
                          })}
                        </div>
                        {err("consultationTypes")}
                      </fieldset>

                      <div>
                        <label htmlFor="booking-industry" className="mb-1.5 block text-sm font-medium text-text-secondary">Industry <span className="text-text-muted/60">(optional)</span></label>
                        <select {...inputProps("industry")} value={form.industry} onChange={(e) => set("industry", e.target.value)}>
                          <option value="">Select your industry</option>
                          {INDUSTRIES.map((i) => (
                            <option key={i.value} value={i.value}>{i.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  {/* STEP 3 */}
                  {step === 3 && (
                    <div className="space-y-7">
                      <fieldset>
                        <legend className="mb-2.5 text-sm font-medium text-text-secondary">How would you like to meet?</legend>
                        <div className="grid gap-3 sm:grid-cols-3">
                          {MEETING_OPTIONS.map(({ value, label, hint, icon: Icon }) => {
                            const active = form.meetingType === value;
                            return (
                              <button
                                key={value}
                                type="button"
                                role="radio"
                                aria-checked={active}
                                onClick={() => set("meetingType", value)}
                                className={`rounded-xl border-2 p-4 text-left transition-colors ${
                                  active ? "border-secondary bg-secondary/10" : "border-white/10 hover:border-secondary/40"
                                }`}
                              >
                                <Icon size={20} className={active ? "text-secondary" : "text-text-muted"} aria-hidden="true" />
                                <span className="mt-2 block font-semibold text-text-primary">{label}</span>
                                <span className="block text-xs text-text-muted">{hint}</span>
                              </button>
                            );
                          })}
                        </div>
                      </fieldset>

                      <div>
                        <label htmlFor="booking-preferredDate" className="mb-1.5 block text-sm font-medium text-text-secondary">Preferred date</label>
                        <input
                          {...inputProps("preferredDate")}
                          type="date"
                          min={todayISO()}
                          value={form.preferredDate}
                          onChange={(e) => set("preferredDate", e.target.value)}
                          style={{ colorScheme: "dark" }}
                          className={`${inputProps("preferredDate").className} sm:max-w-xs`}
                        />
                        {err("preferredDate")}
                      </div>

                      <fieldset>
                        <legend className="mb-2.5 text-sm font-medium text-text-secondary">
                          Preferred time <span className="text-text-muted/60">(East Africa Time)</span>
                        </legend>
                        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                          {TIME_SLOTS.map((slot) => {
                            const active = !customTime && form.preferredTime === slot;
                            return (
                              <button
                                key={slot}
                                type="button"
                                aria-pressed={active}
                                onClick={() => {
                                  setCustomTime(false);
                                  set("preferredTime", active ? "" : slot);
                                }}
                                className={`rounded-lg border px-2 py-2.5 text-sm transition-colors ${
                                  active ? "border-secondary bg-secondary font-semibold text-white" : "border-white/15 text-text-secondary hover:border-secondary/50"
                                }`}
                              >
                                {formatTime(slot)}
                              </button>
                            );
                          })}
                          <button
                            type="button"
                            aria-pressed={customTime}
                            onClick={() => {
                              setCustomTime((v) => !v);
                              set("preferredTime", "");
                            }}
                            className={`rounded-lg border px-2 py-2.5 text-sm transition-colors ${
                              customTime ? "border-secondary bg-secondary/15 font-semibold text-secondary" : "border-white/15 text-text-secondary hover:border-secondary/50"
                            }`}
                          >
                            Other
                          </button>
                        </div>
                        {customTime && (
                          <input
                            type="time"
                            aria-label="Other preferred time"
                            value={form.preferredTime}
                            onChange={(e) => set("preferredTime", e.target.value)}
                            style={{ colorScheme: "dark" }}
                            className={`${fieldClass} mt-3 border-white/10 focus:border-secondary sm:max-w-xs`}
                          />
                        )}
                      </fieldset>

                      <p className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-text-secondary">
                        If your preferred time is already taken, we&apos;ll offer the next available slot and confirm it with you by email.
                      </p>
                    </div>
                  )}

                  {/* STEP 4 */}
                  {step === 4 && (
                    <div className="space-y-5">
                      {[
                        {
                          to: 1,
                          title: "Your details",
                          lines: [form.name, form.email, form.phone, form.company].filter(Boolean),
                        },
                        {
                          to: 2,
                          title: "Your needs",
                          lines: [form.businessChallenge, interests.length ? `Interested in: ${interests.join(", ")}` : ""].filter(Boolean),
                        },
                        {
                          to: 3,
                          title: "Meeting",
                          lines: [meeting.label, whenText],
                        },
                      ].map((block) => (
                        <div key={block.title} className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-text-muted">{block.title}</h3>
                            <button type="button" onClick={() => goTo(block.to)} className="inline-flex items-center gap-1.5 text-sm font-medium text-secondary hover:underline">
                              <Pencil size={13} aria-hidden="true" /> Edit
                            </button>
                          </div>
                          <div className="mt-2 space-y-1">
                            {block.lines.map((line, i) => (
                              <p key={i} className="whitespace-pre-wrap break-words text-[15px] text-text-primary">{line}</p>
                            ))}
                          </div>
                        </div>
                      ))}

                      <div className="rounded-xl border-2 border-secondary/25 bg-secondary/[0.06] p-5">
                        <div className="flex items-baseline justify-between gap-4">
                          <span className="font-semibold text-text-primary">Consultation (60 minutes)</span>
                          <span className="font-sora text-xl font-bold text-text-primary">{PRICE}</span>
                        </div>
                        <p className="mt-1 text-right text-xs text-text-muted">excl. 16% VAT</p>
                        <ul className="mt-4 space-y-2 text-sm text-text-secondary">
                          {[
                            "In-depth analysis of your business challenge",
                            "Expert recommendations and strategic guidance",
                            "Actionable next steps and implementation roadmap",
                            "Follow-up summary document",
                          ].map((item) => (
                            <li key={item} className="flex items-start gap-2">
                              <Check size={16} className="mt-0.5 flex-shrink-0 text-success" aria-hidden="true" /> {item}
                            </li>
                          ))}
                        </ul>
                        <p className="mt-4 border-t border-white/10 pt-4 text-sm text-text-secondary">
                          <strong className="text-text-primary">No payment now.</strong> We email your invoice once the booking is confirmed. Payment is due before the consultation.
                        </p>
                      </div>

                      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 p-4">
                        <input
                          type="checkbox"
                          checked={acceptedTerms}
                          onChange={(e) => setAcceptedTerms(e.target.checked)}
                          className="mt-0.5 h-5 w-5 flex-shrink-0 accent-[#FC8436]"
                        />
                        <span className="text-sm text-text-secondary">
                          I understand this is a paid consultation ({PRICE} excl. VAT) and agree to receive an invoice, payable before the consultation.
                        </span>
                      </label>
                    </div>
                  )}
                </div>

                {/* Navigation */}
                <div className="mt-8 flex items-center justify-between gap-3 border-t border-white/10 pt-6">
                  {step > 1 ? (
                    <Button type="button" variant="ghost" onClick={() => goTo(step - 1)} disabled={isSubmitting}>
                      <ArrowLeft size={18} aria-hidden="true" /> Back
                    </Button>
                  ) : (
                    <span />
                  )}
                  <Button type="submit" variant="primary" size="lg" isLoading={isSubmitting} disabled={step === 4 && !acceptedTerms}>
                    {step < 4 ? (
                      <>
                        Continue <ArrowRight size={18} aria-hidden="true" />
                      </>
                    ) : (
                      <>
                        Confirm booking <Send size={18} aria-hidden="true" />
                      </>
                    )}
                  </Button>
                </div>
                {step === 4 && !acceptedTerms && (
                  <p className="mt-3 text-right text-xs text-text-muted">Tick the box above to confirm.</p>
                )}
              </form>
            </div>

            {/* Sidebar */}
            <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-2xl border border-white/10 bg-primary-dark/60 p-6">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-text-muted">Your booking</h2>
                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-text-muted">Session</dt>
                    <dd className="text-right font-medium text-text-primary">60-minute consultation</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-text-muted">Format</dt>
                    <dd className="text-right font-medium text-text-primary">{meeting.label}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-text-muted">When</dt>
                    <dd className="text-right font-medium text-text-primary">{whenText}</dd>
                  </div>
                  <div className="flex justify-between gap-4 border-t border-white/10 pt-3">
                    <dt className="text-text-muted">Price</dt>
                    <dd className="text-right">
                      <span className="font-sora text-lg font-bold text-text-primary">{PRICE}</span>
                      <span className="block text-xs text-text-muted">excl. VAT · pay after confirmation</span>
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="rounded-2xl border border-white/10 bg-primary-dark/60 p-6">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-text-muted">What happens next</h2>
                <ol className="mt-4 space-y-4 text-sm">
                  {[
                    "You get a confirmation email straight away.",
                    "We confirm your time and send your invoice.",
                    "You get reminders before the meeting.",
                  ].map((text, i) => (
                    <li key={text} className="flex gap-3">
                      <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-secondary/15 text-xs font-bold text-secondary">{i + 1}</span>
                      <span className="text-text-secondary">{text}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="rounded-2xl border border-white/10 bg-primary-dark/60 p-6 text-sm">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-text-muted">Prefer to talk?</h2>
                <a href="tel:+254745247211" className="mt-3 flex items-center gap-2 font-medium text-text-primary hover:text-secondary">
                  <Phone size={16} className="text-secondary" aria-hidden="true" /> +254 745 247 211
                </a>
                <a href="mailto:consulting@veyratech.co.ke" className="mt-2 flex items-center gap-2 font-medium text-text-primary hover:text-secondary">
                  <Mail size={16} className="text-secondary" aria-hidden="true" /> consulting@veyratech.co.ke
                </a>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}

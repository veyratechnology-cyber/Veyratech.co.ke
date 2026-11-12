import { recordHandlers } from "@/lib/admin/crud";

export const dynamic = "force-dynamic";

const handlers = recordHandlers("leads");
export const GET = handlers.GET;
export const PATCH = handlers.PATCH;
export const DELETE = handlers.DELETE;

/** HTML escaping helpers for building emails / generated documents. */

// -----------------------------------------------------------------------------
// HTML escaping
// -----------------------------------------------------------------------------

const HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
  "`": "&#96;",
};

export function escapeHtml(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value).replace(/[&<>"'`]/g, (ch) => HTML_ESCAPES[ch]);
}

/** Returns the URL if it is http(s) or mailto, otherwise "#". Always HTML-escaped. */
export function safeUrl(value: unknown): string {
  if (typeof value !== "string") return "#";
  const trimmed = value.trim();
  if (/^(https?:|mailto:)/i.test(trimmed)) return escapeHtml(trimmed);
  return "#";
}

/**
 * Returns a copy of `data` with every string HTML-escaped (recursively through
 * arrays / plain objects). Keys that look like links (…Url, …Link, href) are
 * passed through safeUrl() instead. Dates and numbers are left untouched.
 */
export function escapeData<T>(data: T): T {
  const walk = (value: unknown, key = ""): unknown => {
    if (typeof value === "string") {
      return /(url|link|href)$/i.test(key) ? safeUrl(value) : escapeHtml(value);
    }
    if (Array.isArray(value)) return value.map((v) => walk(v, key));
    if (value && typeof value === "object" && Object.getPrototypeOf(value) === Object.prototype) {
      const out: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(value)) out[k] = walk(v, k);
      return out;
    }
    return value;
  };
  return walk(data) as T;
}

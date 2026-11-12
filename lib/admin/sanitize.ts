import sanitizeHtml from "sanitize-html";

/**
 * Sanitise admin-authored article HTML before it is stored or rendered with
 * dangerouslySetInnerHTML. Removes scripts, iframes, inline event handlers,
 * style attributes and javascript: URLs; keeps normal article formatting.
 */
export function sanitizeRichHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      "h2", "h3", "h4", "p", "br", "hr", "strong", "b", "em", "i", "u", "s", "blockquote",
      "ul", "ol", "li", "a", "img", "figure", "figcaption", "code", "pre", "span",
      "table", "thead", "tbody", "tr", "th", "td",
    ],
    allowedAttributes: {
      a: ["href", "title", "target", "rel"],
      img: ["src", "alt", "title", "width", "height", "loading"],
      "*": ["class"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedSchemesByTag: { img: ["https", "data"] },
    transformTags: {
      a: (tagName, attribs) => ({
        tagName,
        attribs: attribs.target === "_blank" ? { ...attribs, rel: "noopener noreferrer" } : attribs,
      }),
      img: (tagName, attribs) => ({ tagName, attribs: { loading: "lazy", ...attribs } }),
    },
  });
}

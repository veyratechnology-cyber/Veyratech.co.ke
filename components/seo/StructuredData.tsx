/**
 * Structured Data (JSON-LD) for SEO.
 *
 * Rendered as plain <script> tags in the server HTML. (next/script de-duplicates
 * by id, which previously dropped all but the first block on a page.)
 */

interface StructuredDataProps {
  data: Record<string, any>;
}

// Escape "<" so a value can never close the script tag.
const serialize = (data: unknown) => JSON.stringify(data).replace(/</g, "\u003c");

export function StructuredData({ data }: StructuredDataProps) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serialize(data) }} />;
}

interface SEOScriptsProps {
  schemas: Array<Record<string, any>>;
}

export function SEOScripts({ schemas }: SEOScriptsProps) {
  return (
    <>
      {schemas.map((schema, index) => (
        <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: serialize(schema) }} />
      ))}
    </>
  );
}

export default StructuredData;

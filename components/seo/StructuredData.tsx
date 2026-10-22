/**
 * Structured Data Component
 * Easily add JSON-LD structured data to any page
 */

import Script from 'next/script';

interface StructuredDataProps {
  data: Record<string, any> | Array<Record<string, any>>;
}

export function StructuredData({ data }: StructuredDataProps) {
  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data, null, 2),
      }}
    />
  );
}

// Pre-built structured data components for common use cases

interface SEOScriptsProps {
  schemas: Array<Record<string, any>>;
}

export function SEOScripts({ schemas }: SEOScriptsProps) {
  return (
    <>
      {schemas.map((schema, index) => (
        <Script
          key={index}
          id={`structured-data-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema, null, 2),
          }}
        />
      ))}
    </>
  );
}

export default StructuredData;

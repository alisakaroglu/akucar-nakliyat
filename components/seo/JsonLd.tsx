// schema.org JSON-LD'yi <script> olarak basar (server component).
// data tek nesne ya da nesne dizisi olabilir.
export function JsonLd({ data }: { data: object | object[] }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}

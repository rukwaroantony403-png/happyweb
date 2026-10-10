import Link from "next/link";

type BreadcrumbItem = { name: string; path: string };

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const siteUrl = process.env.HOTEL_SITE_URL || "https://happylandhoteldiani.co.ke";
  const breadcrumbs = [{ name: "Home", path: "/" }, ...items];
  return <JsonLd data={{
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map(({ name, path }, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name,
      item: new URL(path, siteUrl).toString(),
    })),
  }} />;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const breadcrumbs = [{ name: "Home", path: "/" }, ...items];
  return <>
    <BreadcrumbJsonLd items={items} />
    <nav className="interior-breadcrumb site-breadcrumb" aria-label="Breadcrumb">
      {breadcrumbs.map(({ name, path }, index) => <span key={path}>
        {index > 0 && <span aria-hidden="true"> / </span>}
        {index === breadcrumbs.length - 1 ? <span aria-current="page">{name}</span> : <Link href={path}>{name}</Link>}
      </span>)}
    </nav>
  </>;
}

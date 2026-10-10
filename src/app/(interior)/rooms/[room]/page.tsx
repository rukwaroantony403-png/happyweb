import RoomDetailsBrowser from "./room-details-browser";
import { BreadcrumbJsonLd, JsonLd } from "@/components/structured-data";
import { getIndexableHotelSnapshot } from "@/lib/seo-data";
import { pageMetadata } from "@/lib/seo";
import type { PublishedRoom } from "@/lib/booking-system";

type Props = { params: Promise<{ room: string }> };

export const revalidate = 30;

function getRoomName(slug: string) {
  return slug.split("-").map((part) => part ? part[0].toUpperCase() + part.slice(1) : "").join(" ");
}

export async function generateMetadata({ params }: Props) {
  const { room: slug } = await params;
  const snapshot = await getIndexableHotelSnapshot();
  const room = snapshot?.rooms.find((item) => item.slug === slug);
  const name = room?.name || getRoomName(slug);
  return pageMetadata({
    title: name,
    description: room?.shortDescription || room?.description || `View ${name}, guest capacity, amenities and current published rate at HappyLand Hotel Diani.`,
    path: `/rooms/${encodeURIComponent(slug)}`,
    image: room?.image || room?.images?.[0] || "/images/side.png",
    imageAlt: `${name} at HappyLand Hotel Diani`,
  });
}

export default async function RoomDetailsPage({ params }: Props) {
  const { room: slug } = await params;
  const snapshot = await getIndexableHotelSnapshot();
  const room = snapshot?.rooms.find((item) => item.slug === slug) || null;
  const siteUrl = process.env.HOTEL_SITE_URL || "https://happylandhoteldiani.co.ke";
  const nightlyRate = room ? room.nightlyRateKsh || room.defaultRateKsh : 0;
  const product = room ? {
    "@context": "https://schema.org",
    "@type": "Product",
    name: room.name,
    description: room.description || room.shortDescription || `${room.name} accommodation at HappyLand Hotel Diani.`,
    image: [...new Set([room.image, ...(room.images || [])].filter((photo): photo is string => Boolean(photo)))].map((photo) => new URL(photo, siteUrl).toString()),
    brand: { "@type": "Brand", name: "HappyLand Hotel Diani" },
    offers: nightlyRate > 0 ? {
      "@type": "Offer",
      url: new URL(`/rooms/${encodeURIComponent(slug)}`, siteUrl).toString(),
      price: nightlyRate,
      priceCurrency: snapshot?.property.currency || "KES",
      seller: { "@type": "Hotel", name: "HappyLand Hotel Diani", url: siteUrl },
    } : undefined,
  } : null;
  const initialRoom: PublishedRoom | null | undefined = snapshot ? room : undefined;

  return <>
    {room && <BreadcrumbJsonLd items={[{ name: "Rooms", path: "/rooms" }, { name: room.name, path: `/rooms/${encodeURIComponent(slug)}` }]} />}
    {product && <JsonLd data={product} />}
    <RoomDetailsBrowser slug={slug} initialRoom={initialRoom} />
  </>;
}

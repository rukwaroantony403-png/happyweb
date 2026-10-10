import type { MetadataRoute } from "next";
import { getIndexableHotelSnapshot } from "@/lib/seo-data";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.HOTEL_SITE_URL || "https://happylandhoteldiani.co.ke";
  const routes = [
    ["/", 1],
    ["/rooms", 0.9],
    ["/experiences", 0.8],
    ["/dining", 0.7],
    ["/gallery", 0.7],
    ["/about", 0.7],
    ["/offers", 0.7],
    ["/contact", 0.6],
    ["/book", 0.8],
    ["/faq", 0.7],
  ] as const;
  const snapshot = await getIndexableHotelSnapshot();
  const roomRoutes = snapshot?.rooms.map((room) => [`/rooms/${encodeURIComponent(room.slug)}`, 0.8] as const) || [];

  return [...routes, ...roomRoutes].map(([path, priority]) => ({
    url: new URL(path, siteUrl).toString(),
    changeFrequency: "monthly",
    priority,
  }));
}
import type { MetadataRoute } from "next";
import { getPublicHotelSnapshot } from "@/lib/booking-system";

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
  ] as const;
  const rooms = await getPublicHotelSnapshot();
  const roomRoutes = rooms.rooms.map((room) => [`/rooms/${encodeURIComponent(room.slug)}`, 0.8] as const);

  return [...routes, ...roomRoutes].map(([path, priority]) => ({
    url: new URL(path, siteUrl).toString(),
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority,
  }));
}
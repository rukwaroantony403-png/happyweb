import { getBookingSystemUrl } from "@/lib/booking-system";

export const dynamic = "force-dynamic";

const photoPathPattern = /^(?:[a-z0-9-]{2,60}\/)?[a-f0-9]{32}\.(?:jpg|png|webp|avif)$/;

export async function GET(_request: Request, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  const relativePath = path.join("/");
  if (!photoPathPattern.test(relativePath)) return new Response("Not found", { status: 404 });

  try {
    const upstream = await fetch(new URL(`/api/room-photos/${relativePath}`, getBookingSystemUrl()), {
      cache: "force-cache",
      next: { revalidate: 60 * 60 * 24 * 365 },
    });
    if (!upstream.ok) return new Response("Not found", { status: upstream.status === 404 ? 404 : 502 });
    const headers = new Headers({
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    });
    const contentType = upstream.headers.get("content-type");
    if (contentType?.startsWith("image/")) headers.set("Content-Type", contentType);
    return new Response(upstream.body, { headers });
  } catch (error) {
    console.error("Room photo request to the staff booking system failed", error);
    return new Response("Room photo service unavailable", { status: 502 });
  }
}

import { getPublicHotelSnapshot } from "@/lib/booking-system";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const snapshot = await getPublicHotelSnapshot();
    return Response.json(snapshot, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Could not load public hotel content from the staff booking system", error);
    return Response.json(
      { error: "Public room information is temporarily unavailable." },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}

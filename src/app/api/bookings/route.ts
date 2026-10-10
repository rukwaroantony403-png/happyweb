import { forwardBookingSystemRequest } from "@/lib/booking-system";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let data: unknown;
  try {
    data = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  return forwardBookingSystemRequest(
    request,
    "/api/bookings",
    JSON.stringify({ ...(data as Record<string, unknown>), source: "Website" }),
  );
}

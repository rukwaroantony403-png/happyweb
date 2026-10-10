import { forwardBookingSystemRequest } from "@/lib/booking-system";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid booking lookup." }, { status: 400 });
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return Response.json({ error: "Invalid booking lookup." }, { status: 400 });
  }
  return forwardBookingSystemRequest(request, "/api/payments/lookup", JSON.stringify(body));
}

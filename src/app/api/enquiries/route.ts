import { forwardBookingSystemRequest } from "@/lib/booking-system";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  return forwardBookingSystemRequest(request, "/api/enquiries");
}

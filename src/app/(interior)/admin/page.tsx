import { redirect } from "next/navigation";
import { getBookingSystemUrl } from "@/lib/booking-system";

export default function AdminPage() {
  redirect(getBookingSystemUrl().toString());
}

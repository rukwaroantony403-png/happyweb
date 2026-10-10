import type { Metadata } from "next";
import { InteriorPage, SectionHeading } from "@/components/interior-page";
import { BookingRequestForm } from "@/components/hotel-forms";
import { hotelPhoto } from "@/lib/hotel-content";

export const metadata: Metadata = { title: "Book Your Stay", description: "Check configured room availability and confirm a stay at HappyLand Hotel Diani." };
export default async function BookPage({ searchParams }: { searchParams: Promise<{ roomSlug?: string | string[]; checkIn?: string | string[]; checkOut?: string | string[]; guests?: string | string[] }> }) {
  const params = await searchParams;
  const roomSlug = typeof params.roomSlug === "string" && /^[a-z0-9-]{2,60}$/.test(params.roomSlug) ? params.roomSlug : "";
  const checkIn = typeof params.checkIn === "string" && /^\d{4}-\d{2}-\d{2}$/.test(params.checkIn) ? params.checkIn : "";
  const checkOut = typeof params.checkOut === "string" && /^\d{4}-\d{2}-\d{2}$/.test(params.checkOut) ? params.checkOut : "";
  const guests = typeof params.guests === "string" && /^(?:[1-9]|1\d|20)$/.test(params.guests) ? params.guests : "2";
  return <><InteriorPage eyebrow="Book your stay" title="Your Diani escape starts here" intro="Choose your dates, check configured room availability and confirm your reservation online." image={hotelPhoto("photo-1571896349842-33c89424de2d", 1800)} imageAlt="A tropical resort beside the coast"/><section className="interior-content"><div className="wrap"><SectionHeading eyebrow="DIRECT BOOKING" title="Check dates and book" text="Choose your stay, enter your details, and confirm. Your booking is checked against live hotel inventory."/><div className="booking-page-grid"><BookingRequestForm initialRoomSlug={roomSlug} initialCheckIn={checkIn} initialCheckOut={checkOut} initialGuests={guests}/><aside className="booking-summary"><span className="section-kicker">BOOKING DETAILS</span><h3>Secure your dates</h3><p>Your room is reserved only after you receive a booking reference on screen. Availability is checked again when you confirm, to guard against overlapping bookings.</p><p>Partial payments are welcome after the hotel confirms current M-Pesa details. Every submitted transaction is verified by staff before it counts as paid.</p><a className="text-link" href="/payment">Open guest payment portal →</a><a className="text-link" href="/contact">Contact the hotel with a question →</a></aside></div></div></section></>;
}

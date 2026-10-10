import type { Metadata } from "next";
import { InteriorPage, SectionHeading } from "@/components/interior-page";
import { BookingRequestForm } from "@/components/hotel-forms";
import { hotelPhoto } from "@/lib/hotel-content";

export const metadata: Metadata = { title: "Book Your Stay", description: "Check room availability and send a booking request to HappyLand Hotel Diani for staff confirmation." };
export default async function BookPage({ searchParams }: { searchParams: Promise<{ roomSlug?: string | string[]; checkIn?: string | string[]; checkOut?: string | string[]; guests?: string | string[] }> }) {
  const params = await searchParams;
  const roomSlug = typeof params.roomSlug === "string" && /^[a-z0-9-]{2,60}$/.test(params.roomSlug) ? params.roomSlug : "";
  const checkIn = typeof params.checkIn === "string" && /^\d{4}-\d{2}-\d{2}$/.test(params.checkIn) ? params.checkIn : "";
  const checkOut = typeof params.checkOut === "string" && /^\d{4}-\d{2}-\d{2}$/.test(params.checkOut) ? params.checkOut : "";
  const guests = typeof params.guests === "string" && /^(?:[1-9]|1\d|20)$/.test(params.guests) ? params.guests : "2";
  return <><InteriorPage eyebrow="Book your stay" title="Your Diani escape starts here" intro="Choose your dates, check live room availability and send a booking request for the hotel team to review." image={hotelPhoto("photo-1571896349842-33c89424de2d", 1800)} imageAlt="A tropical resort beside the coast"/><section className="interior-content"><div className="wrap"><SectionHeading eyebrow="DIRECT BOOKING" title="Request your stay" text="Choose available dates and send your details. A hotel staff member will review and confirm your booking before payment is accepted."/><div className="booking-page-grid"><BookingRequestForm initialRoomSlug={roomSlug} initialCheckIn={checkIn} initialCheckOut={checkOut} initialGuests={guests}/><aside className="booking-summary"><span className="section-kicker">BOOKING DETAILS</span><h3>Request your dates</h3><p>Your request is checked against live inventory and the room is held while the hotel reviews it. Keep your booking reference and wait for staff confirmation before making a payment.</p><p>After confirmation, contact the hotel for current M-Pesa details. Staff verify every submitted transaction before it counts as paid.</p><a className="text-link" href="/contact">Contact the hotel with a question →</a></aside></div></div></section></>;
}

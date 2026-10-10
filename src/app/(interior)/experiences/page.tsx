import type { Metadata } from "next";
import { InteriorPage, DetailBand } from "@/components/interior-page";
import { HotelDiningGallery } from "@/components/hotel-dining-gallery";
import { hotelPhoto } from "@/lib/hotel-content";

export const metadata: Metadata = { title: "Experiences in Diani", description: "Find inspiration for beach days, coastal adventures and relaxed escapes in Diani, Kenya." };
export default function ExperiencesPage() {
  return <><InteriorPage eyebrow="Experience Diani" title="Days made for the coast" intro="Let the Indian Ocean set the pace. Find inspiration for your stay, from beach escapes to time exploring the Diani coast." image={hotelPhoto("photo-1500375592092-40eb2168fd21", 1800)} imageAlt="Turquoise water rolling onto a tropical beach"/><HotelDiningGallery eyebrow="Back at HappyLand" title="Slow evenings, shared moments" text="Take a look at the dining spaces and relaxed moments around the hotel. Please contact the team to confirm current dining service and availability."/><DetailBand eyebrow="Back at HappyLand" title="A place to unwind after a day out" text="Come back to HappyLand and ease into the rest of your stay. Contact the hotel for current facilities, availability and local recommendations." image="/images/side.png" imageAlt="HappyLand Hotel Diani and its swimming pool" reverse/></>;
}

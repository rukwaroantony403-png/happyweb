import type { Metadata } from "next";
import { InteriorPage, PhotoCard, SectionHeading, DetailBand } from "@/components/interior-page";
import { HotelDiningGallery } from "@/components/hotel-dining-gallery";
import { hotelPhoto } from "@/lib/hotel-content";

export const metadata: Metadata = { title: "Experiences in Diani", description: "Find inspiration for beach days, coastal adventures and relaxed escapes in Diani, Kenya." };
const items = [
  ["Beach escapes", "Take the day slowly, feel the sea breeze and enjoy the long sweep of the Diani coastline.", "photo-1500375592092-40eb2168fd21"],
  ["Coastal adventures", "Ask the hotel team about activities and trusted local experiences available during your stay.", "photo-1510414842594-a61c69b5ae57"],
  ["Romantic getaways", "Make time for a quieter escape, a special occasion or simply being together.", "photo-1511895426328-dc8714191300"],
  ["Family escapes", "Trade the usual routine for open skies, warm water and time together.", "photo-1500530855697-b586d89ba3ee"],
  ["Local experiences", "Get to know the culture, flavours and natural beauty of Kenya's coast.", "photo-1516026672322-bc52d61a55d5"],
  ["Rest and recharge", "Leave space in your plans for slow starts and an easy coastal pace.", "photo-1533104816931-20fa691ff6ca"],
];
export default function ExperiencesPage() {
  return <><InteriorPage eyebrow="Experience Diani" title="Days made for the coast" intro="Let the Indian Ocean set the pace. Find inspiration for your stay, from beach escapes to time exploring the Diani coast." image={hotelPhoto("photo-1500375592092-40eb2168fd21", 1800)} imageAlt="Turquoise water rolling onto a tropical beach"/><section className="interior-content"><div className="wrap"><SectionHeading eyebrow="EXPLORE THE COAST" title="Make the most of every day" text="Experiences and activities vary by season and provider. Ask the hotel team what is available during your dates."/><div className="photo-card-grid">{items.map(([title, text, id]) => <PhotoCard key={title} title={title} text={text} image={hotelPhoto(id, 850)} imageAlt={title}/>)}</div></div></section><HotelDiningGallery eyebrow="Back at HappyLand" title="Slow evenings, shared moments" text="Take a look at the dining spaces and relaxed moments around the hotel. Please contact the team to confirm current dining service and availability."/><DetailBand eyebrow="Back at HappyLand" title="A place to unwind after a day out" text="Come back to HappyLand and ease into the rest of your stay. Contact the hotel for current facilities, availability and local recommendations." image="/images/side.png" imageAlt="HappyLand Hotel Diani and its swimming pool" reverse/></>;
}

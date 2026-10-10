import { InteriorPage, PhotoCard, SectionHeading } from "@/components/interior-page";
import { hotelGallery } from "@/lib/hotel-photography";
import { Breadcrumbs } from "@/components/structured-data";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Hotel Offers in Diani", description: "Ask HappyLand Hotel Diani about current offers, available dates and terms for your stay.", path: "/offers", image: "/images/exteriornight.png", imageAlt: "HappyLand Hotel Diani illuminated at night" });
const offers = [
  { title: "Weekend getaway", text: "Make a little room in the calendar for some time on the coast.", photo: hotelGallery[1] },
  { title: "Romantic escape", text: "Plan a thoughtful break for two for your dates.", photo: hotelGallery[0] },
  { title: "Family holiday", text: "Trade the usual routine for a coastal change of pace.", photo: hotelGallery[3] },
  { title: "Longer stay", text: "Settle in and see a little more of Kenya's coast.", photo: hotelGallery[2] },
  { title: "Early booking", text: "Get in touch about planning ahead for your preferred dates.", photo: hotelGallery[1] },
  { title: "Seasonal offers", text: "Ask the hotel what is available during your travel dates.", photo: hotelGallery[0] },
] as const;
export default function OffersPage() {
  return <><Breadcrumbs items={[{ name: "Offers", path: "/offers" }]} /><InteriorPage eyebrow="Offers & escapes" title="Make your escape special" intro="Planning a weekend away, a romantic break or a longer stay? Ask the hotel about offers available for your dates." image="/images/exteriornight.png" imageAlt="HappyLand Hotel Diani illuminated at night"/><section className="interior-content"><div className="wrap"><SectionHeading eyebrow="CURRENT OFFERS" title="Something to look forward to" text="Offers, prices, dates and terms are managed by the hotel. Enquire directly for current availability; no unverified deals are shown here."/><div className="photo-card-grid">{offers.map(({ title, text, photo }) => <PhotoCard key={title} title={title} text={text} image={photo.src} imageAlt={photo.alt} href="/contact"/>)}</div></div></section></>;
}

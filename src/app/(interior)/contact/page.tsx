import { InteriorPage, SectionHeading } from "@/components/interior-page";
import { EnquiryForm } from "@/components/hotel-forms";
import { hotelPhone, hotelPhoneDisplay, hotelPhoto } from "@/lib/hotel-content";
import { Breadcrumbs } from "@/components/structured-data";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Contact HappyLand Hotel Diani", description: "Call or message HappyLand Hotel Diani about room options, booking requests, directions and visiting Diani, Kenya.", path: "/contact" });
export default function ContactPage() {
  return <><Breadcrumbs items={[{ name: "Contact", path: "/contact" }]} /><InteriorPage eyebrow="Get in touch" title="We would love to hear from you" intro="Questions about a stay, room details or planning your trip? Send an enquiry and the HappyLand team can help with the information you need." image={hotelPhoto("photo-1500375592092-40eb2168fd21", 1800)} imageAlt="The turquoise Diani coastline"/><section className="interior-content"><div className="wrap"><SectionHeading eyebrow="CONTACT HAPPYLAND" title="How can we help?" text="Share a little about your trip and what you would like to know."/><div className="page-contact-grid"><aside className="page-contact-details"><h3>Find us in Diani</h3><p>HappyLand Hotel Diani<br/>Diani, Kwale County, Kenya</p><p>Call us: <a href={`tel:${hotelPhone}`}>{hotelPhoneDisplay}</a></p><a href="https://maps.google.com/?q=Diani+Beach+Kenya" target="_blank" rel="noreferrer">Open Diani on Google Maps →</a></aside><EnquiryForm/></div></div></section></>;
}

import HotelExperience from "./hotel-experience";
import { JsonLd } from "@/components/structured-data";
import { hotelPhone } from "@/lib/hotel-content";

export default function Home() {
  const siteUrl = process.env.HOTEL_SITE_URL || "https://happylandhoteldiani.co.ke";
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Hotel",
    name: "HappyLand Hotel Diani",
    description: "A welcoming coastal stay in Diani, Kenya. Where Every Stay Feels Like Paradise.",
    url: siteUrl,
    telephone: hotelPhone,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Diani",
      addressRegion: "Kwale County",
      addressCountry: "KE",
    },
    image: new URL("/images/herohome.png", siteUrl).toString(),
  };

  return (
    <>
      <HotelExperience />
      <JsonLd data={structuredData} />
    </>
  );
}

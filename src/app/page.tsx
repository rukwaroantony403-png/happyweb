import HotelExperience from "./hotel-experience";

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Hotel",
    name: "HappyLand Hotel Diani",
    description: "A welcoming coastal stay in Diani, Kenya. Where Every Stay Feels Like Paradise.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Diani",
      addressRegion: "Kwale County",
      addressCountry: "KE",
    },
    image: new URL("/images/herohome.png", process.env.HOTEL_SITE_URL || "https://happylandhoteldiani.co.ke").toString(),
  };

  return (
    <>
      <HotelExperience />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    </>
  );
}

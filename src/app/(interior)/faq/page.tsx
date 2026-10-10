import Link from "next/link";
import { Breadcrumbs, JsonLd } from "@/components/structured-data";
import { hotelPhoneDisplay } from "@/lib/hotel-content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Hotel FAQs",
  description: "Answers about HappyLand Hotel Diani, room details, booking requests, payments and visiting Diani, Kenya.",
  path: "/faq",
});

const questions = [
  {
    question: "Where is HappyLand Hotel Diani?",
    answer: "The hotel is in Diani, Kwale County, Kenya. Contact the hotel team for the exact street address, directions or transfer information.",
  },
  {
    question: "How do I book a room?",
    answer: "Browse the live room listings, choose your dates, check availability and submit a booking request. The hotel team reviews each request and must confirm it before it becomes a booking.",
  },
  {
    question: "How can I check room rates and availability?",
    answer: "Room details, published rates and photos are provided by the hotel system. Availability depends on your dates, so use the booking form to check your stay dates and wait for staff confirmation.",
  },
  {
    question: "What amenities are available in each room?",
    answer: "Amenities are listed on each room page when provided by the hotel team. Room facilities may vary; contact the hotel to confirm specific amenities or accessibility requirements.",
  },
  {
    question: "How do I pay after submitting a booking request?",
    answer: `Wait until the hotel confirms your booking before making a payment. Then call ${hotelPhoneDisplay} to confirm current M-Pesa instructions. Payment submissions remain pending until staff verify them.`,
  },
  {
    question: "Can I confirm dining services before my stay?",
    answer: "Menus, service times and dining availability can change. Contact the hotel team for current details.",
  },
];

export default function FaqPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };

  return <>
    <Breadcrumbs items={[{ name: "FAQs", path: "/faq" }]} />
    <JsonLd data={structuredData} />
    <section className="interior-content"><div className="wrap">
      <span className="section-kicker">HELPFUL INFORMATION</span>
      <h1 className="interior-heading-title">HappyLand Hotel Diani FAQs</h1>
      <p>Useful information about rooms, booking requests, payments and your visit to Diani.</p>
      <div className="feature-list">{questions.map(({ question, answer }) => <div key={question}><b>{question}</b><span>{answer}</span></div>)}</div>
      <p><Link href="/rooms">Explore rooms</Link> · <Link href="/book">Check your dates</Link> · <Link href="/contact">Contact the hotel</Link></p>
    </div></section>
  </>;
}

import { hotelPhone, hotelPhoneDisplay } from "@/lib/hotel-content";
import Link from "next/link";

const faqs = [
  {
    question: "Where is HappyLand Hotel Diani?",
    text: "The hotel is in Diani, Kwale County, Kenya. Contact the hotel team for the exact street address, directions or transfer information.",
    answer: <>The hotel is in Diani, Kwale County, Kenya. Contact the hotel team for the exact street address, directions or transfer information.</>,
  },
  {
    question: "How do I book a room?",
    text: "Browse the live room listings, choose your dates, check availability and submit a booking request. The hotel team reviews each request and must confirm it before it becomes a booking.",
    answer: <>Browse the <Link href="/rooms">live room listings</Link>, choose your dates, check availability and submit a booking request. The hotel team reviews each request and must confirm it before it becomes a booking.</>,
  },
  {
    question: "How can I check room rates and availability?",
    text: "Room details, published rates and photos are provided by the hotel system. Availability depends on your dates, so use the booking form to check your stay dates and wait for staff confirmation.",
    answer: <>Room details, published rates and photos are provided by the hotel system. Availability depends on your dates, so use the <Link href="/book">booking form</Link> to check your stay dates and wait for staff confirmation.</>,
  },
  {
    question: "What amenities are available in each room?",
    text: "Amenities are listed on each room page when provided by the hotel team. Room facilities may vary; contact the hotel to confirm specific amenities or accessibility requirements.",
    answer: <>Amenities are listed on each room page when provided by the hotel team. Room facilities may vary; <Link href="/contact">contact the hotel</Link> to confirm specific amenities or accessibility requirements.</>,
  },
  {
    question: "How do I pay after submitting a booking request?",
    text: `Wait until the hotel confirms your booking before making a payment. Then call ${hotelPhoneDisplay} to confirm current M-Pesa instructions. Payment submissions remain pending until staff verify them.`,
    answer: <>Wait until the hotel confirms your booking before making a payment. Then call <a href={`tel:${hotelPhone}`}>{hotelPhoneDisplay}</a> to confirm current M-Pesa instructions. Payment submissions remain pending until staff verify them.</>,
  },
  {
    question: "Can I confirm dining services before my stay?",
    text: "Menus, service times and dining availability can change. Contact the hotel team for current details.",
    answer: <>Menus, service times and dining availability can change. Contact the hotel team for current details.</>,
  },
];

export function FooterFaqs() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ question, text }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text },
    })),
  };

  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
    <details className="footer-faq-toggle">
      <summary>FAQs</summary>
      <div className="footer-faq-panel">
        <b>Frequently asked questions</b>
        {faqs.map(({ question, answer }) => <details key={question}>
          <summary>{question}</summary>
          <p>{answer}</p>
        </details>)}
        <a className="footer-faq-contact" href={`tel:${hotelPhone}`}>Need more help? Call {hotelPhoneDisplay}</a>
      </div>
    </details>
  </>;
}

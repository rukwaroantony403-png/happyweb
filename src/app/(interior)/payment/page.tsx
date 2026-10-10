import { GuestPaymentPortal } from "@/components/guest-payment-portal";
import { InteriorPage } from "@/components/interior-page";
import { hotelPhoto } from "@/lib/hotel-content";
import { pageMetadata } from "@/lib/seo";

export const metadata = {
  ...pageMetadata({
    title: "Guest Payment Portal",
    description: "Submit partial M-Pesa payments for your HappyLand Hotel Diani booking.",
    path: "/payment",
    image: hotelPhoto("photo-1542314831-068cd1dbfeeb", 1800),
    imageAlt: "A welcoming hotel stay",
  }),
  robots: { index: false, follow: true },
};

export default async function PaymentPage({ searchParams }: { searchParams: Promise<{ reference?: string | string[] }> }) {
  const params = await searchParams;
  const reference = typeof params.reference === "string" && /^[A-Z0-9-]{6,80}$/i.test(params.reference) ? params.reference : "";
  return <>
    <InteriorPage eyebrow="Guest payment portal" title="A more flexible way to pay" intro="Review your booking balance and submit M-Pesa payments in the amounts and instalments that suit you." image={hotelPhoto("photo-1542314831-068cd1dbfeeb", 1800)} imageAlt="A welcoming hotel stay"/>
    <section className="interior-content"><div className="wrap"><GuestPaymentPortal initialReference={reference}/></div></section>
  </>;
}

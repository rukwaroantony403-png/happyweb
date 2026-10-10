import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.HOTEL_SITE_URL || "https://happylandhoteldiani.co.ke"),
  title: {
    default: "HappyLand Hotel Diani | Coastal Stays in Diani, Kenya",
    template: "%s | HappyLand Hotel Diani",
  },
  description: "Find your place on the Kenyan coast. Discover HappyLand Hotel Diani, a welcoming base for relaxed stays, beach days and memorable moments in Diani.",
  keywords: ["Hotels in Diani", "Hotel in Diani Beach", "Diani Beach accommodation", "Hotels in Diani Kenya", "Beach hotel Diani", "Where to stay in Diani", "Diani hotel booking"],
  openGraph: {
    title: "HappyLand Hotel Diani",
    description: "Where Every Stay Feels Like Paradise.",
    type: "website",
    locale: "en_KE",
    images: [{ url: "/images/herohome.png", alt: "Palm-framed shoreline and turquoise water near Diani" }],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

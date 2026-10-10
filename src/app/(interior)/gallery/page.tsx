import type { Metadata } from "next";
import { InteriorPage, SectionHeading } from "@/components/interior-page";
import GalleryWall from "@/components/gallery-wall";

export const metadata: Metadata = { title: "Gallery", description: "Explore images of Diani's coastline, tropical stays and the HappyLand Hotel Diani experience." };
export default function GalleryPage() {
  return <><InteriorPage eyebrow="A glimpse of HappyLand" title="HappyLand moments" intro="Take a closer look at the hotel, pool and selected apartment spaces in Diani." image="/images/RestaurantSideview5.jpg" imageAlt="HappyLand Hotel Diani beside its swimming pool"/><section className="interior-content"><div className="wrap"><SectionHeading eyebrow="HAPPYLAND PHOTO GALLERY" title="A closer look at the hotel" text="Explore selected property and apartment photos. For current room-specific photos and details, visit the live accommodation listings."/><GalleryWall/></div></section></>;
}

import { InteriorPage, SectionHeading } from "@/components/interior-page";
import GalleryWall from "@/components/gallery-wall";
import { Breadcrumbs } from "@/components/structured-data";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Hotel Gallery in Diani", description: "View property photos of HappyLand Hotel Diani, the pool, dining spaces and Diani's coastline.", path: "/gallery", image: "/images/RestaurantSideview5.jpg", imageAlt: "HappyLand Hotel Diani beside its swimming pool" });
export default function GalleryPage() {
  return <><Breadcrumbs items={[{ name: "Gallery", path: "/gallery" }]} /><InteriorPage eyebrow="A glimpse of HappyLand" title="HappyLand moments" intro="Take a closer look at the hotel, pool and selected apartment spaces in Diani." image="/images/RestaurantSideview5.jpg" imageAlt="HappyLand Hotel Diani beside its swimming pool"/><section className="interior-content"><div className="wrap"><SectionHeading eyebrow="HAPPYLAND PHOTO GALLERY" title="A closer look at the hotel" text="Explore selected property and apartment photos. For current room-specific photos and details, visit the live accommodation listings."/><GalleryWall/></div></section></>;
}

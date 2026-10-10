import RoomsBrowser from "./rooms-browser";
import { Breadcrumbs } from "@/components/structured-data";
import { pageMetadata } from "@/lib/seo";
import { getIndexableHotelSnapshot } from "@/lib/seo-data";
import type { PublishedRoom } from "@/lib/booking-system";

export const revalidate = 30;

export const metadata = pageMetadata({
  title: "Rooms & Suites in Diani",
  description: "Browse live rooms, photos and published rates at HappyLand Hotel Diani. Check date-specific availability online.",
  path: "/rooms",
  image: "/images/side.png",
  imageAlt: "HappyLand Hotel Diani and its swimming pool",
});

export default async function RoomsPage() {
  const snapshot = await getIndexableHotelSnapshot();
  const initialRooms: PublishedRoom[] | undefined = snapshot?.rooms;
  return <><Breadcrumbs items={[{ name: "Rooms", path: "/rooms" }]} /><RoomsBrowser initialRooms={initialRooms} /></>;
}

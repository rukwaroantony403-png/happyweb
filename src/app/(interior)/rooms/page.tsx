import type { Metadata } from "next";
import RoomsBrowser from "./rooms-browser";

export const revalidate = 30;

export const metadata: Metadata = {
  title: "Rooms & Suites",
  description: "Explore current rooms, photos and rates at HappyLand Hotel Diani.",
};

export default function RoomsPage() {
  return <RoomsBrowser />;
}

import type { Metadata } from "next";
import RoomDetailsBrowser from "./room-details-browser";

type Props = { params: Promise<{ room: string }> };

export const revalidate = 30;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { room: slug } = await params;
  const name = slug.split("-").map((part) => part ? part[0].toUpperCase() + part.slice(1) : "").join(" ");
  return { title: `${name} | Rooms`, description: `Explore ${name} at HappyLand Hotel Diani.` };
}

export default async function RoomDetailsPage({ params }: Props) {
  const { room: slug } = await params;
  return <RoomDetailsBrowser slug={slug} />;
}

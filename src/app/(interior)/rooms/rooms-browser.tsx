"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { InteriorPage, SectionHeading } from "@/components/interior-page";
import PrefetchLink from "@/components/prefetch-link";
import type { PublishedRoom } from "@/lib/booking-system";
import { hasFreshRoomCatalog, publishRoomCatalog, useRoomCatalog } from "@/lib/room-catalog-cache";

export default function RoomsBrowser({ initialRooms }: { initialRooms?: PublishedRoom[] }) {
  const catalogRooms = useRoomCatalog();
  const [rooms, setRooms] = useState<PublishedRoom[] | null>(() => initialRooms ?? catalogRooms);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    let active = true;
    let refreshing = false;
    const refreshRooms = async () => {
      if (refreshing) return;
      refreshing = true;
      try {
        const response = await fetch("/api/public/hotel", { cache: "no-store" });
        const result: unknown = await response.json();
        if (!response.ok || !result || typeof result !== "object" || !("rooms" in result)) {
          throw new Error("Room details are temporarily unavailable.");
        }
        const freshRooms = result.rooms;
        if (!Array.isArray(freshRooms) || !freshRooms.every((room) => room && typeof room.slug === "string" && typeof room.name === "string")) {
          throw new Error("The hotel returned invalid room details.");
        }
        if (!active) return;
        publishRoomCatalog(freshRooms as PublishedRoom[]);
        setRooms(freshRooms as PublishedRoom[]);
        setUnavailable(false);
      } catch {
        if (active && !hasFreshRoomCatalog()) setUnavailable(true);
      } finally {
        refreshing = false;
      }
    };
    if (!hasFreshRoomCatalog()) void refreshRooms();
    const timer = window.setInterval(() => void refreshRooms(), 30000);
    const refreshWhenVisible = () => { if (document.visibilityState === "visible") void refreshRooms(); };
    window.addEventListener("focus", refreshWhenVisible);
    document.addEventListener("visibilitychange", refreshWhenVisible);

    return () => {
      active = false;
      window.clearInterval(timer);
      window.removeEventListener("focus", refreshWhenVisible);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, []);

  const loaded = rooms !== null || unavailable;

  return <>
    <InteriorPage eyebrow="Stay in comfort" title="A room for your Diani escape" intro="Thoughtful spaces to unwind after a day by the coast. Ask our team about room details, current rates and availability." image="/images/side.png" imageAlt="HappyLand Hotel Diani and its swimming pool" />
    <section className="interior-content"><div className="wrap">
      <SectionHeading eyebrow="ROOMS & SUITES" title="Find your place to unwind" text="Room details, photos and rates are maintained by the HappyLand hotel team." />
      {rooms?.length ? <div className="photo-card-grid">{rooms.map((room) => { const roomImage = room.image || room.images?.[0]; return <PrefetchLink className="photo-card" href={`/rooms/${room.slug}`} key={room.slug}><div className="photo-card-image">{roomImage ? <Image src={roomImage} alt={`${room.name} at HappyLand Hotel Diani`} fill sizes="(max-width:760px) 90vw, 32vw" /> : <div className="room-photo-placeholder" aria-hidden="true"><span>Room photo coming soon</span></div>}</div><div className="photo-card-copy"><h3>{room.name}</h3><p>{room.shortDescription || room.description || "Ask the hotel team about this room."}</p><span className="text-link">View room <span aria-hidden="true">→</span></span></div></PrefetchLink>; })}</div>
        : !loaded ? <div className="photo-card-grid" aria-label="Loading room details">{[0, 1, 2].map((item) => <div className="photo-card room-card-skeleton" key={item}><div className="photo-card-image"/><div className="photo-card-copy"><span/><span/><span/></div></div>)}</div>
        : <p className="content-note">{unavailable ? "Live room details are temporarily unavailable. Please try again shortly or contact the hotel team for assistance." : "Room information is being prepared. Please contact the hotel team for assistance."}</p>}
    </div></section>
  </>;
}

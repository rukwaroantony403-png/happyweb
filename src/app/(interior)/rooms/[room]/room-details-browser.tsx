"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { DetailBand } from "@/components/interior-page";
import { RoomAvailabilityBooking } from "@/components/hotel-forms";
import type { PublishedRoom } from "@/lib/booking-system";
import { hasFreshRoomCatalog, publishRoomCatalog, useRoomCatalog } from "@/lib/room-catalog-cache";
import RoomDetailsSkeleton from "./room-details-skeleton";

function findRoom(value: unknown, slug: string): PublishedRoom | null {
  if (!Array.isArray(value)) return null;
  const room = value.find((item) => item && typeof item.slug === "string" && item.slug === slug && typeof item.name === "string");
  return room || null;
}

function amenityIconName(amenity: string) {
  const label = amenity.toLowerCase();
  if (label.includes("bed")) return "bed";
  if (label.includes("bathroom")) return "bathroom";
  if (label.includes("wi-fi") || label.includes("wifi")) return "wifi";
  if (label.includes("tv") || label.includes("television")) return "tv";
  if (label.includes("air conditioning") || label.includes("fan")) return "fan";
  if (label.includes("kitchen") || label.includes("cooking")) return "kitchen";
  if (label.includes("refrigerator") || label.includes("fridge")) return "fridge";
  if (label.includes("wardrobe")) return "wardrobe";
  if (label.includes("linen")) return "linen";
  if (label.includes("towel")) return "towel";
  if (label.includes("shower")) return "shower";
  if (label.includes("dining") || label.includes("seating")) return "dining";
  if (label.includes("outlet") || label.includes("power")) return "power";
  if (label.includes("housekeeping")) return "housekeeping";
  return "check";
}

function AmenityIcon({ name }: { name: string }) {
  const paths: Record<string, string> = {
    bed: "M3 18V6 M3 15h18v5 M6 11h5a3 3 0 0 1 3 3v1H3v-1a3 3 0 0 1 3-3z M15 12h3a3 3 0 0 1 3 3v1h-7v-1a3 3 0 0 1 1-3z",
    bathroom: "M4 12h16v2a6 6 0 0 1-6 6h-4a6 6 0 0 1-6-6v-2z M7 12V6a3 3 0 0 1 6 0 M5 21l2-1 M17 20l2 1",
    wifi: "M3 9a14 14 0 0 1 18 0 M6 12a9 9 0 0 1 12 0 M9 15a4 4 0 0 1 6 0 M12 19h.01",
    tv: "M3 5h18v13H3z M8 22h8 M12 18v4",
    fan: "M12 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0 M12 10c-1-7 2-8 4-6 2 2 0 5-3 7 M14 12c7-1 8 2 6 4-2 2-5 0-7-3 M12 14c1 7-2 8-4 6-2-2 0-5 3-7 M10 12c-7 1-8-2-6-4 2-2 5 0 7 3",
    kitchen: "M5 3h14v18H5z M9 3v7h6V3 M8 14h2 M14 14h2 M8 18h2 M14 18h2",
    fridge: "M6 3h12v18H6z M6 11h12 M9 7v2 M9 14v3",
    wardrobe: "M5 3h14v18H5z M12 3v18 M9 10h.01 M15 10h.01",
    linen: "M4 5h16v14H4z M4 10h16 M8 5v5 M16 5v5 M8 14h8",
    towel: "M6 3h12v18H6z M9 7h6 M9 11h6 M9 15h6",
    shower: "M4 9a8 8 0 0 1 16 0 M12 9v3 M5 12h14 M7 16v1 M11 16v1 M15 16v1 M19 16v1",
    dining: "M3 11h18 M5 11l1 9h12l1-9 M8 11V8a4 4 0 0 1 8 0v3 M12 3v2",
    power: "M9 3v7 M15 3v7 M7 10h10v2a5 5 0 0 1-5 5v4 M12 17v4",
    housekeeping: "M4 20h16 M7 17l8-12 3 2-8 12z M5 12l4 6 M15 8l3-3",
    check: "M5 12l4 4L19 6",
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name] || paths.check}/></svg>;
}

export default function RoomDetailsBrowser({ slug, initialRoom }: { slug: string; initialRoom?: PublishedRoom | null }) {
  const rooms = useRoomCatalog();
  const room = initialRoom ?? findRoom(rooms, slug);
  const [unavailable, setUnavailable] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const loaded = initialRoom !== undefined || rooms !== null || unavailable;

  useEffect(() => {
    if (initialRoom !== undefined) return;
    if (hasFreshRoomCatalog()) return;
    let active = true;
    fetch("/api/public/hotel", { cache: "no-store" })
      .then(async (response) => {
        const result: unknown = await response.json();
        if (!response.ok || !result || typeof result !== "object" || !("rooms" in result) || !Array.isArray(result.rooms)) throw new Error("Room information is unavailable.");
        if (!active) return;
        if (!result.rooms.every((item) => item && typeof item.slug === "string" && typeof item.name === "string")) throw new Error("Room information is invalid.");
        publishRoomCatalog(result.rooms as PublishedRoom[]);
      })
      .catch(() => { if (active && !hasFreshRoomCatalog()) setUnavailable(true); });

    return () => { active = false; };
  }, [initialRoom]);

  if (!room) {
    if (!loaded) return <RoomDetailsSkeleton />;
    return <section className="interior-content"><div className="wrap room-detail-loading" role="status">
      <h1>Room details are temporarily unavailable</h1><p>Please return to the room list or contact the hotel team for help.</p>
      <Link className="gold-button" href="/rooms">Browse all rooms</Link>
    </div></section>;
  }

  const galleryPhotos = [...new Set([room.image, ...(room.images || [])].filter((photo): photo is string => Boolean(photo)))];
  const visibleGalleryPhotos = galleryPhotos.slice(0, 5);
  const nightlyRate = room.nightlyRateKsh || room.defaultRateKsh;

  return <>
    <section className="interior-content room-detail-content"><div className="wrap">
      <div className="room-detail-head"><div className="room-detail-title-block"><div className="interior-breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><Link href="/rooms">Rooms</Link><span aria-hidden="true">/</span><span aria-current="page">{room.name}</span></div><span className="section-kicker">ROOM DETAILS</span><h1 className="interior-heading-title">{room.name}</h1><p className="room-detail-lead">{room.description || room.shortDescription || "Let our team help you find the right fit for your stay."}</p></div></div>
      {galleryPhotos.length > 0 ? <section className={`room-photo-gallery room-photo-gallery-${visibleGalleryPhotos.length}${galleryPhotos.length > 3 ? " room-photo-gallery-has-more" : ""}`} aria-label={`${room.name} photo gallery`}>
        {visibleGalleryPhotos.map((photo, index) => <div className={`room-photo-gallery-tile${index === 0 ? " room-photo-gallery-main" : ""}`} key={photo}>
          <Image src={photo} alt={`${room.name} photo ${index + 1}`} fill priority={index === 0} sizes={index === 0 ? "(max-width:760px) 100vw, 60vw" : "(max-width:760px) 50vw, 25vw"}/>
          {index === 2 && galleryPhotos.length > 3 && <button className="room-photo-gallery-mobile-all" type="button" onClick={() => setGalleryOpen(true)}>Show all {galleryPhotos.length} photos</button>}
          {index === 4 && galleryPhotos.length > 5 && <button className="room-photo-show-all" type="button" onClick={() => setGalleryOpen(true)}>Show all {galleryPhotos.length} photos</button>}
        </div>)}
      </section> : <div className="room-detail-photo-placeholder">Room photography is being prepared</div>}
      <div className="feature-list"><div><b>Guests</b><span>{room.guests || room.maxGuests}</span></div><div><b>Bed configuration</b><span>{room.bed || room.bedConfiguration || "Please enquire"}</span></div><div><b>Rate</b><span>{nightlyRate ? `From KES ${new Intl.NumberFormat("en-KE").format(nightlyRate)} per night` : "Check dates for rates"}</span></div></div>
      <RoomAvailabilityBooking roomSlug={room.slug} roomName={room.name} maxGuests={room.maxGuests}/>
      {room.amenities?.length ? <section className="room-amenities" aria-labelledby="room-amenities-title"><div className="room-amenities-heading"><span className="section-kicker">COMFORTS & FACILITIES</span><h2 id="room-amenities-title">Amenities</h2></div><ul>{room.amenities.map((amenity) => <li key={amenity}><span className="room-amenity-icon"><AmenityIcon name={amenityIconName(amenity)}/></span><span>{amenity}</span></li>)}</ul></section> : <div className="content-note">Please contact the hotel team to confirm room facilities and special requirements.</div>}
    </div></section>
    {galleryOpen && <div className="room-photo-lightbox" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setGalleryOpen(false); }}><section className="room-photo-lightbox-panel" role="dialog" aria-modal="true" aria-label={`${room.name} photos`}><header><div><span className="section-kicker">ROOM GALLERY</span><h2>{room.name}</h2></div><button type="button" onClick={() => setGalleryOpen(false)} aria-label="Close photo gallery">×</button></header><div className="room-photo-lightbox-grid">{galleryPhotos.map((photo, index) => <figure key={photo}><div><Image src={photo} alt={`${room.name} photo ${index + 1}`} fill sizes="(max-width:760px) 100vw, 45vw"/></div><figcaption>{room.name} · Photo {index + 1} of {galleryPhotos.length}</figcaption></figure>)}</div></section></div>}
    <DetailBand eyebrow="Your stay, your pace" title="Make room for the coast" text="From quiet mornings to days spent exploring Diani, choose a comfortable starting point for your time on the Kenyan coast. Room services and amenities are confirmed by the hotel team." image="/images/side.png" imageAlt="HappyLand Hotel Diani and its swimming pool" reverse />
  </>;
}

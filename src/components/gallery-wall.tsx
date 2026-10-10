"use client";

import Image from "next/image";
import { useState } from "react";
import { hotelGallery } from "@/lib/hotel-photography";

export default function GalleryWall() {
  const [selected, setSelected] = useState<number | null>(null);
  return <>
    <div className="image-wall">{hotelGallery.map((photo, index) => <button type="button" key={photo.src} onClick={() => setSelected(index)} aria-label={`Open photo: ${photo.label}`}><Image src={photo.src} alt={photo.alt} fill sizes="(max-width:760px) 50vw, 25vw" /><span>{photo.label}</span></button>)}</div>
    {selected !== null && <div className="modal-backdrop gallery-backdrop" role="dialog" aria-modal="true" aria-label={hotelGallery[selected].label} onClick={() => setSelected(null)}><div className="gallery-view" onClick={(event) => event.stopPropagation()}><Image src={hotelGallery[selected].src} alt={hotelGallery[selected].alt} fill sizes="100vw"/><button className="modal-close" type="button" onClick={() => setSelected(null)} aria-label="Close gallery">×</button><button className="gallery-arrow prev" type="button" aria-label="Previous image" onClick={() => setSelected((selected + hotelGallery.length - 1) % hotelGallery.length)}>‹</button><button className="gallery-arrow next" type="button" aria-label="Next image" onClick={() => setSelected((selected + 1) % hotelGallery.length)}>›</button></div></div>}
  </>;
}

import Image from "next/image";

const photos = [
  {
    src: "/images/restaurantdetails-2.jpg",
    alt: "A hand opening a cold drink at a restaurant table",
    caption: "A moment at the table",
  },
  {
    src: "/images/restaurantdetails-3.jpg",
    alt: "A drink being poured at a table",
    caption: "Something refreshing",
  },
  {
    src: "/images/restaurantdetails-4.jpg",
    alt: "Dining tables arranged inside the restaurant",
    caption: "Settle in",
  },
  {
    src: "/images/restaurantdetails-5.jpg",
    alt: "Restaurant seating looking toward the warmly lit bar",
    caption: "Warm evening light",
  },
  {
    src: "/images/restaurantdetails-6.jpg",
    alt: "A table set in front of the restaurant bar",
    caption: "A place to share",
  },
  {
    src: "/images/restaurantdetails-8.jpg",
    alt: "A member of the hotel team serving at the bar",
    caption: "A friendly welcome",
  },
  {
    src: "/images/restaurantdetails-9.jpg",
    alt: "Restaurant tables beside the pool after dark",
    caption: "By the pool after dark",
  },
  {
    src: "/images/restaurantdetails-10.jpg",
    alt: "Restaurant tables with a television in the background",
    caption: "The dining room",
  },
  {
    src: "/images/restaurantwide.jpg",
    alt: "Wide view across HappyLand's dining room and bar",
    caption: "Room to gather",
  },
  {
    src: "/images/restaurantwide-2.jpg",
    alt: "A second wide view across the restaurant seating",
    caption: "Make yourself at home",
  },
];

export function HotelDiningGallery({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text: string;
}) {
  return (
    <section className="hotel-dining-gallery" aria-label={title}>
      <div className="wrap">
        <header className="hotel-dining-gallery-heading">
          <span className="section-kicker">{eyebrow}</span>
          <h2>{title}</h2>
          <p>{text}</p>
        </header>
        <div className="hotel-dining-mosaic">
          {photos.map((photo) => (
            <figure className="hotel-dining-photo" key={photo.src}>
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 34vw"
              />
              <figcaption>{photo.caption}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

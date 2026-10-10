import type { Metadata } from "next";

const siteName = "HappyLand Hotel Diani";

export function pageMetadata({
  title,
  description,
  path,
  image = "/images/herohome.png",
  imageAlt = "HappyLand Hotel Diani on the Kenyan coast",
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  imageAlt?: string;
}): Metadata {
  const socialTitle = title.toLowerCase().includes(siteName.toLowerCase()) ? title : `${title} | ${siteName}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: socialTitle,
      description,
      type: "website",
      locale: "en_KE",
      siteName,
      url: path,
      images: [{ url: image, alt: imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [{ url: image, alt: imageAlt }],
    },
  };
}

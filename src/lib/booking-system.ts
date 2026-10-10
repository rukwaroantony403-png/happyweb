import "server-only";

export type PublishedRoom = {
  slug: string;
  name: string;
  type?: "room" | "combination";
  inventory: number;
  maxGuests: number;
  guests: number;
  nightlyRateKsh: number;
  defaultRateKsh: number;
  shortDescription?: string;
  description?: string;
  image?: string;
  images?: string[];
  bed?: string;
  bedConfiguration?: string;
  bedCount?: number;
  amenities?: string[];
};

export type PublicHotelSnapshot = {
  property: {
    name: string;
    destination: string;
    currency: string;
    tagline: string;
  };
  rooms: PublishedRoom[];
};

const staffRoomPhotoPrefix = "/api/room-photos/";

function websiteRoomPhotoUrl(asset: string) {
  if (!asset) return asset;
  try {
    const url = new URL(asset, getBookingSystemUrl());
    if (url.pathname.startsWith(staffRoomPhotoPrefix)) {
      return `${"/api/staff-room-photos/"}${url.pathname.slice(staffRoomPhotoPrefix.length)}${url.search}`;
    }
  } catch {
    // Leave non-URL asset values unchanged; the snapshot validator handles invalid data.
  }
  return asset;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isOptionalString(value: unknown) {
  return value === undefined || typeof value === "string";
}

function isPublishedRoom(value: unknown): value is PublishedRoom {
  return isRecord(value) &&
    typeof value.slug === "string" &&
    typeof value.name === "string" &&
    typeof value.inventory === "number" &&
    typeof value.maxGuests === "number" &&
    typeof value.guests === "number" &&
    typeof value.nightlyRateKsh === "number" &&
    typeof value.defaultRateKsh === "number" &&
    isOptionalString(value.shortDescription) &&
    isOptionalString(value.description) &&
    isOptionalString(value.image) &&
    isOptionalString(value.bed) &&
    isOptionalString(value.bedConfiguration) &&
    (value.images === undefined || (Array.isArray(value.images) && value.images.every((image) => typeof image === "string"))) &&
    (value.amenities === undefined || (Array.isArray(value.amenities) && value.amenities.every((amenity) => typeof amenity === "string")));
}

function isLocalPreviewHost(hostname: string) {
  return ["localhost", "127.0.0.1", "::1"].includes(hostname);
}

export function getBookingSystemUrl() {
  const configuredUrl = process.env.BOOKING_SYSTEM_URL;
  if (!configuredUrl) {
    throw new Error("BOOKING_SYSTEM_URL must point to the HappyLand staff booking system.");
  }

  const url = new URL(configuredUrl);
  if (!["https:", "http:"].includes(url.protocol) || url.username || url.password || url.pathname !== "/" || url.search || url.hash) {
    throw new Error("BOOKING_SYSTEM_URL must be an HTTP(S) origin without a path, query, or fragment.");
  }
  if (process.env.NODE_ENV === "production" && url.protocol !== "https:" && !isLocalPreviewHost(url.hostname)) {
    throw new Error("BOOKING_SYSTEM_URL must use HTTPS in production unless it is a localhost preview URL.");
  }
  return url;
}

export async function getPublicHotelSnapshot(): Promise<PublicHotelSnapshot> {
  // Keep room content briefly warm; date-specific availability remains live through its own API.
  const response = await fetch(new URL("/api/public/hotel", getBookingSystemUrl()), { next: { revalidate: 30 } });
  if (!response.ok) {
    throw new Error(`The staff booking system could not provide hotel content (HTTP ${response.status}).`);
  }

  const result: unknown = await response.json();
  if (!isRecord(result) || !isRecord(result.property) ||
      typeof result.property.name !== "string" ||
      typeof result.property.destination !== "string" ||
      typeof result.property.currency !== "string" ||
      typeof result.property.tagline !== "string" ||
      !Array.isArray(result.rooms) ||
      !result.rooms.every(isPublishedRoom)) {
    throw new Error("The staff booking system returned an invalid hotel-content response.");
  }
  return {
    property: {
      name: result.property.name,
      destination: result.property.destination,
      currency: result.property.currency,
      tagline: result.property.tagline,
    },
    rooms: result.rooms.map((room) => ({
      ...room,
      image: room.image ? websiteRoomPhotoUrl(room.image) : room.image,
      images: room.images?.map(websiteRoomPhotoUrl),
    })),
  };
}

export async function forwardBookingSystemRequest(request: Request, path: string, body?: string) {
  try {
    const url = new URL(path, getBookingSystemUrl());
    url.search = new URL(request.url).search;
    const response = await fetch(url, {
      method: request.method,
      headers: request.headers.get("content-type") ? { "Content-Type": request.headers.get("content-type")! } : undefined,
      body: body ?? (request.method === "GET" || request.method === "HEAD" ? undefined : await request.text()),
      cache: "no-store",
    });
    const contentType = response.headers.get("content-type") || "application/json";
    return new Response(await response.text(), {
      status: response.status,
      headers: { "Content-Type": contentType, "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error(`Request to the staff booking system failed (${path})`, error);
    return Response.json(
      { error: "The booking service is temporarily unavailable. Please try again shortly." },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}

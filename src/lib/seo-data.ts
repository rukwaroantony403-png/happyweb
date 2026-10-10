import "server-only";
import { cache } from "react";
import { getPublicHotelSnapshot } from "@/lib/booking-system";

export const getIndexableHotelSnapshot = cache(async () => {
  try {
    return await getPublicHotelSnapshot();
  } catch (error) {
    console.error("Live hotel content could not be loaded for search metadata.", error);
    return null;
  }
});

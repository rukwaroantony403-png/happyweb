import type { NextConfig } from "next";

const bookingSystemUrl = new URL(process.env.BOOKING_SYSTEM_URL || "https://portal.happylandhoteldiani.co.ke");
const allowedImageHosts = (process.env.HOTEL_IMAGE_HOSTS || "")
  .split(",")
  .map((hostname) => hostname.trim())
  .filter(Boolean);

if (allowedImageHosts.some((hostname) => !/^(?:[a-z0-9-]+\.)*[a-z0-9-]+$/i.test(hostname))) {
  throw new Error("HOTEL_IMAGE_HOSTS must be a comma-separated list of hostnames.");
}

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      {
        protocol: bookingSystemUrl.protocol.slice(0, -1) as "http" | "https",
        hostname: bookingSystemUrl.hostname,
        port: bookingSystemUrl.port,
        pathname: "/**",
      },
      ...allowedImageHosts.map((hostname) => ({ protocol: "https" as const, hostname, pathname: "/**" })),
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
};

export default nextConfig;

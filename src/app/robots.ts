import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.HOTEL_SITE_URL || "https://happylandhoteldiani.co.ke";
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: ["Googlebot", "Bingbot", "GPTBot", "OAI-SearchBot", "ChatGPT-User", "PerplexityBot", "ClaudeBot", "Google-Extended"], allow: "/" },
    ],
    sitemap: new URL("/sitemap.xml", siteUrl).toString(),
  };
}
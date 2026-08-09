import type { MetadataRoute } from "next";

const staticRoutes = [
  "", "/services", "/pricing", "/case-studies", "/blog", "/contact", "/tools",
  "/tools/seo-checker", "/tools/utm-generator", "/tools/roi-calculator", "/privacy", "/terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return staticRoutes.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.7,
  }));
}

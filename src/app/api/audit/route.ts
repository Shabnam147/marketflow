import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import Audit from "@/models/Audit";
import { getSessionFromCookies } from "@/lib/auth";
import { rateLimit } from "@/lib/rateLimit";

const auditSchema = z.object({ url: z.string().url() });

/**
 * Lightweight, honest server-side website checks — NOT a full SEO audit.
 * We fetch the page once, look at headers/HTML we already have, and
 * make cheap same-origin checks for robots.txt / sitemap.xml.
 */
export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  const { allowed } = rateLimit(`audit:${ip}`, 10, 60_000);
  if (!allowed) return NextResponse.json({ error: "Too many audits. Try again shortly." }, { status: 429 });

  const parsed = auditSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Enter a valid URL." }, { status: 400 });

  const targetUrl = parsed.data.url;
  const origin = new URL(targetUrl).origin;

  const startedAt = Date.now();
  let httpStatus = 0;
  let html = "";
  try {
    const res = await fetch(targetUrl, { redirect: "follow" });
    httpStatus = res.status;
    html = await res.text();
  } catch {
    return NextResponse.json({ error: "Could not reach that URL. Check it and try again." }, { status: 422 });
  }
  const loadTimeMs = Date.now() - startedAt;

  const hasHttps = targetUrl.startsWith("https://");
  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  const pageTitle = titleMatch?.[1]?.trim();
  const metaDescMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i);
  const metaDescription = metaDescMatch?.[1]?.trim();
  const h1Count = (html.match(/<h1[\s>]/gi) || []).length;
  const hasMobileViewport = /<meta[^>]+name=["']viewport["']/i.test(html);
  const imgTags = html.match(/<img[^>]*>/gi) || [];
  const imagesMissingAlt = imgTags.filter((tag) => !/alt=["'][^"']+["']/i.test(tag)).length;

  let hasRobotsTxt = false;
  let hasSitemap = false;
  try {
    const robotsRes = await fetch(`${origin}/robots.txt`);
    hasRobotsTxt = robotsRes.ok;
  } catch {
    /* ignore */
  }
  try {
    const sitemapRes = await fetch(`${origin}/sitemap.xml`);
    hasSitemap = sitemapRes.ok;
  } catch {
    /* ignore */
  }

  const recommendations: string[] = [];
  if (!hasHttps) recommendations.push("Move your site to HTTPS for security and SEO trust.");
  if (!pageTitle) recommendations.push("Add a descriptive <title> tag to your homepage.");
  if (!metaDescription) recommendations.push("Add a meta description to improve click-through from search results.");
  if (h1Count === 0) recommendations.push("Add a single clear H1 heading describing the page.");
  if (h1Count > 1) recommendations.push("Use only one H1 per page; multiple H1s can dilute SEO signals.");
  if (!hasMobileViewport) recommendations.push("Add a responsive viewport meta tag for mobile visitors.");
  if (imagesMissingAlt > 0) recommendations.push(`Add alt text to ${imagesMissingAlt} image(s) for accessibility and SEO.`);
  if (!hasRobotsTxt) recommendations.push("Add a robots.txt file so search engines can crawl your site correctly.");
  if (!hasSitemap) recommendations.push("Add an XML sitemap to help search engines index your pages.");
  if (loadTimeMs > 2000) recommendations.push("Your homepage took over 2s to respond — investigate hosting/caching.");

  const clamp = (n: number) => Math.max(0, Math.min(100, n));
  const scores = {
    seo: clamp(100 - (h1Count === 0 ? 15 : 0) - (!pageTitle ? 15 : 0) - (!metaDescription ? 15 : 0) - (imagesMissingAlt > 0 ? 10 : 0)),
    performance: clamp(100 - Math.min(60, Math.round(loadTimeMs / 50))),
    technicalSeo: clamp(100 - (!hasHttps ? 25 : 0) - (!hasRobotsTxt ? 15 : 0) - (!hasSitemap ? 15 : 0) - (!hasMobileViewport ? 15 : 0)),
    content: clamp(100 - (!pageTitle ? 20 : 0) - (!metaDescription ? 20 : 0) - (h1Count === 0 ? 20 : 0)),
  };

  await connectDB();
  const session = await getSessionFromCookies();
  const audit = await Audit.create({
    url: targetUrl,
    requestedBy: session?.userId,
    httpStatus,
    hasHttps,
    pageTitle,
    metaDescription,
    h1Count,
    hasMobileViewport,
    imagesMissingAlt,
    hasRobotsTxt,
    hasSitemap,
    loadTimeMs,
    scores,
    recommendations,
  });

  return NextResponse.json({
    audit,
    disclaimer: "This is a basic automated check, not a complete professional SEO audit.",
  });
}

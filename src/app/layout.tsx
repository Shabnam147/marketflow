import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "MarketFlow — Digital Marketing Agency | Turn Attention Into Growth",
    template: "%s | MarketFlow",
  },
  description:
    "MarketFlow is a digital marketing agency helping small businesses, startups and e-commerce brands grow with SEO, paid ads, social media and web development.",
  keywords: [
    "digital marketing agency",
    "digital marketing agency Mumbai",
    "SEO services",
    "social media marketing",
    "Google Ads agency",
    "digital marketing services for small businesses",
  ],
  openGraph: {
    title: "MarketFlow — Turn Attention Into Growth",
    description:
      "We help ambitious businesses attract customers, build powerful brands and turn digital traffic into measurable revenue.",
    type: "website",
    siteName: "MarketFlow",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

// app/layout.tsx

import type { Metadata } from "next";
import "./globals.css";

import { Gilda_Display, Great_Vibes } from "next/font/google";
import ClientLayout from "./client-layout";
import RootLayoutComponent from "components/layout/RootLayout";
import Navbar from "components/layout/Navbar";
import Footer from "components/layout/Footer";

const gildaDisplay = Gilda_Display({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-gilda",
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-great-vibes",
});

const siteUrl = "https://something-blue-florida.vercel.app/";
const ogImageUrl = `${siteUrl}/og-image.png`;

/* ---------------- METADATA ---------------- */

export const metadata: Metadata = {
  title: "Something Blue | Florida Wedding Photography & Videography",
  description: "Florida's premier wedding photography and videography studio. We capture timeless moments, elegant celebrations, and genuine emotions with artistic devotion across Florida. Book your experience today.",
  metadataBase: new URL("https://something-blue-florida.vercel.app/"),
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en-US",
    },
  },
  openGraph: {
    title: "Something Blue | Florida Wedding Photography & Videography",
    description: "Florida's premier wedding photography and videography studio. We capture timeless moments, elegant celebrations, and genuine emotions with artistic devotion.",
    url: "https://something-blue-florida.vercel.app/",
    siteName: "Something Blue Florida",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Something Blue Florida Wedding Photography",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Something Blue | Florida Wedding Photography & Videography",
    description: "Florida's premier wedding photography and videography studio. We capture timeless moments, elegant celebrations, and genuine emotions.",
    images: ["/opengraph-image.png"],
  },
};

/* ---------------- ROOT LAYOUT ---------------- */

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${gildaDisplay.variable} ${greatVibes.variable} ${gildaDisplay.className}`}>
      <body>
        {/* NoScript Fallback */}
        <noscript>
          <style>
            {`
              * {
                opacity: 1 !important;
                transform: none !important;
              }
            `}
          </style>
        </noscript>

        <RootLayoutComponent>
          <Navbar />
          <ClientLayout>{children}</ClientLayout>
          <Footer />
        </RootLayoutComponent>
      </body>
    </html>
  );
}

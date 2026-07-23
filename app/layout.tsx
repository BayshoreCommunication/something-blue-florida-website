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
  title: "TAC Solutions",
  description: "Empowering learners with in-demand tech skills, real-world projects, and career support to build a better future.",
  metadataBase: new URL("https://something-blue-florida.vercel.app/"),
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en-US",
    },
  },
  openGraph: {
    images: "/opengraph-image.png",
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

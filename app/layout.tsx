// app/layout.tsx

import type { Metadata } from "next";
import "./globals.css";

import Script from "next/script";
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

const siteUrl = "https://www.somethingblueflorida.com";
const ogImageUrl = `${siteUrl}/opengraph-image.png`;
const GTM_ID = "GTM-MBRBWZC4";

/* ---------------- METADATA ---------------- */

export const metadata: Metadata = {
  title: "Something Blue | Florida Wedding Photography & Videography",
  description: "Florida's premier wedding photography and videography studio. We capture timeless moments, elegant celebrations, and genuine emotions with artistic devotion across Florida. Book your experience today.",
  metadataBase: new URL("https://www.somethingblueflorida.com"),
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en-US",
    },
  },
  openGraph: {
    title: "Something Blue | Florida Wedding Photography & Videography",
    description: "Florida's premier wedding photography and videography studio. We capture timeless moments, elegant celebrations, and genuine emotions with artistic devotion.",
    url: "https://www.somethingblueflorida.com/",
    siteName: "Something Blue Florida",
    images: [
      {
        url: ogImageUrl,
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
    images: [ogImageUrl],
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
      <head>
        {/* Google Tag Manager - dataLayer init */}
        <Script id="gtm-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
          `}
        </Script>

        {/* Google Tag Manager - script */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`}
        />
      </head>

      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        {/* SVG Filter for real-time browser-level image sharpening */}
        <svg style={{ display: 'none', position: 'absolute', width: 0, height: 0 }} aria-hidden="true">
          <filter id="crisp-sharpen">
            <feConvolveMatrix 
              order="3" 
              kernelMatrix="0 -0.12 0 -0.12 1.48 -0.12 0 -0.12 0" 
            />
          </filter>
        </svg>

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

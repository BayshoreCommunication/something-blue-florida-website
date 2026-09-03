"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import footerGalleryImages from "data/footer-gallery.json";
import {
  Mail,
  Phone,
  Instagram,
  Facebook,
} from "lucide-react";
import Container from "./Container";

const GALLERY_SLIDE_DURATION = 1000;
const GALLERY_SLIDE_DELAY = 3000;

export default function Footer() {
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [isGalleryTransitioning, setIsGalleryTransitioning] = useState(true);
  const footerImages = footerGalleryImages as string[];
  const galleryTrackImages = [...footerImages, ...footerImages.slice(0, 5)];

  useEffect(() => {
    if (galleryIndex === footerImages.length) {
      const resetTimer = window.setTimeout(() => {
        setIsGalleryTransitioning(false);
        setGalleryIndex(0);

        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(() => setIsGalleryTransitioning(true));
        });
      }, GALLERY_SLIDE_DURATION);

      return () => window.clearTimeout(resetTimer);
    }

    const slideTimer = window.setTimeout(
      () => setGalleryIndex((currentIndex) => currentIndex + 1),
      GALLERY_SLIDE_DELAY,
    );

    return () => window.clearTimeout(slideTimer);
  }, [footerImages.length, galleryIndex]);

  return (
    <footer className="w-full bg-[#FAF8F5]">
      {/* 1. HORIZONTAL IMAGE BANNER (Instagram Feed Style) */}
      <div className="w-full overflow-hidden border-b border-black">
        <div
          className={`footer-gallery-track flex w-full will-change-transform motion-reduce:transition-none ${
            isGalleryTransitioning
              ? "transition-transform ease-linear"
              : "transition-none"
          }`}
          style={{
            transform: `translate3d(calc(${galleryIndex} * -100% / var(--footer-slides-visible)), 0, 0)`,
            transitionDuration: `${GALLERY_SLIDE_DURATION}ms`,
          }}
        >
          {galleryTrackImages.map((src, index) => (
            <div
              key={`${src}-${index}`}
              className="footer-gallery-slide relative aspect-[3/4] overflow-hidden group select-none"
            >
              <Image
                src={src}
                alt={`Footer wedding gallery image ${(index % footerImages.length) + 1}`}
                fill
                sizes="(max-width: 639px) 50vw, (max-width: 1023px) 25vw, 20vw"
                quality={75}
                loading={index < 6 ? "eager" : "lazy"}
                draggable={false}
                className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 2. MIDDLE FOOTER (Details & Socials) */}
      <div className="py-16 sm:py-20 border-b border-[#BF9F72]/20">
        <Container className="max-w-[1200px] px-6 sm:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-8 items-center">
            {/* Left Column: Logo & Contact */}
            <div className="flex flex-col items-center text-center">
              {/* Monogram logo image */}
              <div className="relative w-80 h-auto mb-4 overflow-hidden select-none">
                <Image
                  src="/images/footer-logo.svg"
                  alt="Something Blue Logo"
                  width={600}
                  height={150}
                  className="object-contain"
                />
              </div>

              {/* Logo Typography details
              <h3 className="text-[15px] font-normal tracking-[0.25em] text-[#0b0c10] uppercase font-serif mb-2">
                Something Blue
              </h3>
              
              <div className="flex items-center justify-center gap-3 mb-2 select-none">
                <span className="text-[#BF9F72] text-[8px] transform rotate-45">◆</span>
              </div>

              <h4 className="text-[10px] font-medium tracking-[0.3em] text-[#BF9F72] uppercase mb-6 font-serif">
                Wedding Photography
              </h4> */}

              {/* Contact Information */}
              <div className="flex flex-col gap-4 text-center">
                <a
                  href="mailto:hello@somethingblueflorida.com"
                  className="flex items-center justify-center gap-3 text-sm text-[#0b0c10] hover:text-[#BF9F72] transition-colors duration-300 font-serif"
                >
                  <span className="text-[#BF9F72]">
                    <Mail size={16} />
                  </span>
                  hello@somethingblueflorida.com
                </a>
                <a
                  href="tel:+15095921745"
                  className="flex items-center justify-center gap-3 text-sm text-[#0b0c10] hover:text-[#BF9F72] transition-colors duration-300 font-serif"
                >
                  <span className="text-[#BF9F72]">
                    <Phone size={16} />
                  </span>
                  Phone: +1 (509) 592-1745
                </a>
              </div>
            </div>

            {/* Right Column: Social Links */}
            <div className="flex flex-col items-center text-center">
              <h3 className="font-script text-[36px] sm:text-[42px] text-gray-800 tracking-wide mb-1 leading-none select-none">
                Find us Elsewhere
              </h3>

              {/* Gold Divider Line */}
              <div className="flex items-center justify-center gap-3 mb-8 select-none">
                <div className="h-[1px] w-16 bg-[#BF9F72]/50" />
                <span className="text-[#BF9F72] text-[8px] transform rotate-45">
                  ◆
                </span>
                <div className="h-[1px] w-16 bg-[#BF9F72]/50" />
              </div>

              {/* Social Channels List */}
              <div className="flex flex-col gap-5 items-start w-fit mx-auto pl-2">
                <a
                  href="https://www.instagram.com/somethingblueflorida?igsi=a2JwdWUzN2RydzQ2"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 text-[11px] font-bold tracking-[0.25em] text-[#0b0c10] hover:text-[#BF9F72] transition-colors uppercase font-serif"
                >
                  <span className="text-[#BF9F72]">
                    <Instagram size={17} />
                  </span>
                  Instagram
                </a>
                <a
                  href="https://www.facebook.com/share/18JFJPfigj/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 text-[11px] font-bold tracking-[0.25em] text-[#0b0c10] hover:text-[#BF9F72] transition-colors uppercase font-serif"
                >
                  <span className="text-[#BF9F72]">
                    <Facebook size={17} />
                  </span>
                  Facebook
                </a>
                {/* <a
                  href="https://pinterest.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 text-[11px] font-bold tracking-[0.25em] text-[#0b0c10] hover:text-[#BF9F72] transition-colors uppercase font-serif"
                >
                  <span className="text-[#BF9F72]">
                    <Compass size={17} />
                  </span>
                  Pinterest
                </a> */}
                {/* <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 text-[11px] font-bold tracking-[0.25em] text-[#0b0c10] hover:text-[#BF9F72] transition-colors uppercase font-serif"
                >
                  <span className="text-[#BF9F72]">
                    <Music2 size={17} />
                  </span>
                  Tiktok
                </a> */}
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* 3. COPYRIGHTS & CREDITS */}
      <div className="py-8 bg-[#FAF8F5]">
        <div className="flex items-center justify-center gap-4 text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] text-gray-700 uppercase font-serif px-4 text-center">
          <div className="hidden sm:block h-[1px] w-12 sm:w-20 bg-[#BF9F72]/50" />
          <span className="text-[#BF9F72] text-[8px] transform rotate-45 hidden sm:inline">
            ◆
          </span>
          <span>
            &copy; {new Date().getFullYear()} Something Blue Wedding Photography
          </span>
          <span className="text-[#BF9F72] text-[8px] transform rotate-45 hidden sm:inline">
            ◆
          </span>
          <div className="hidden sm:block h-[1px] w-12 sm:w-20 bg-[#BF9F72]/50" />
        </div>
      </div>
    </footer>
  );
}

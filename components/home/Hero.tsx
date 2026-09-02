"use client";

import gsap from "gsap";
import LazyImage from "components/common/LazyImage";
import Link from "next/link";
import { useEffect, useRef } from "react";

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const parallaxBoxRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!heroRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Mouse Movement: Watermark Parallax
      const handleMouseMove = (e: MouseEvent) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;

        // Watermark Parallax Logic
        if (parallaxBoxRef.current) {
          const xPos = (clientX / innerWidth - 0.5) * 35;
          const yPos = (clientY / innerHeight - 0.5) * 35;

          gsap.to(parallaxBoxRef.current, {
            x: xPos,
            y: yPos,
            duration: 1.2,
            ease: "power2.out",
            overwrite: "auto",
          });
        }
      };

      // 2. Camera Flash Light Effect on Click
      const handleClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.closest("a") || target.closest("button")) return;

        if (flashRef.current) {
          gsap.fromTo(
            flashRef.current,
            { opacity: 0.85 },
            { opacity: 0, duration: 0.45, ease: "power2.out" },
          );
        }
      };

      const heroEl = heroRef.current;
      if (!heroEl) return;

      heroEl.addEventListener("mousemove", handleMouseMove);
      heroEl.addEventListener("click", handleClick);

      return () => {
        heroEl.removeEventListener("mousemove", handleMouseMove);
        heroEl.removeEventListener("click", handleClick);
      };
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      id="home"
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-[#0b0c10]"
    >
      {/* CAMERA FLASH LIGHT OVERLAY */}
      <div
        ref={flashRef}
        className="absolute inset-0 bg-white opacity-0 pointer-events-none z-50"
      />

      {/* Background Image with smooth looping zoom and pan animation */}
      <div className="absolute inset-0 w-full h-full select-none z-0 overflow-hidden">
        <div className="relative w-full h-full animate-ken-burns">
          <LazyImage
            src="/images/home/hero-img.jpg"
            alt="Wedding Photography Background"
            fill
            priority
            quality={95}
            className="object-cover"
          />
        </div>
        {/* Soft elegant overlay to darken and ensure copy contrast */}
        <div className="absolute inset-0 bg-[#0b0c10]/80 z-10" />
      </div>

      {/* Main Content Area */}
      <div className="relative z-20 flex flex-col items-center justify-center w-full max-w-[1440px] px-4 sm:px-16 lg:px-8 text-center pt-24 pb-12 select-none">
        {/* Watermark Calligraphy Text with Water Parallax */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0">
          <div ref={parallaxBoxRef} className="will-change-transform">
            <div className="font-script text-[65px] sm:text-[120px] md:text-[160px] lg:text-[185px] text-[#BF9F72]/20 whitespace-nowrap select-none leading-none animate-water-wave">
              Wedding <br /> Photography
            </div>
          </div>
        </div>

        {/* Hero Headings (Fixed Center) */}
        <h1 className="text-white text-3xl sm:text-5xl md:text-6xl lg:text-7.5xl font-normal tracking-[0.02em] leading-[1.25] max-w-[950px] z-10 drop-shadow-md select-text">
          Make A Wonderful Story <br />
          For Your Wedding
        </h1>

        {/* Buttons Section */}
        <div className="flex flex-col sm:flex-row gap-5 mt-14 z-10 w-full max-w-[700px] justify-center px-4">
          <Link
            href="/"
            className="border border-[#BF9F72] bg-black/20 backdrop-blur-sm text-white hover:bg-[#BF9F72] hover:text-[#0b0c10] hover:border-[#BF9F72] transition-all duration-300 px-6 sm:px-8 py-4 text-[10px] sm:text-[11px] font-medium tracking-[0.25em] uppercase text-center flex items-center justify-center cursor-pointer"
          >
            Book Your Wedding Photography Experience Today
          </Link>
          <Link
            href="/contact"
            className="group border border-[#BF9F72] bg-black/20 backdrop-blur-sm text-[#BF9F72] hover:bg-[#BF9F72] hover:text-[#0b0c10] hover:border-[#BF9F72] transition-all duration-300 px-6 sm:px-8 py-4 text-[10px] sm:text-[11px] font-medium tracking-[0.25em] uppercase text-center flex items-center justify-center gap-3 whitespace-nowrap cursor-pointer"
          >
            Contact Me{" "}
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
              &rarr;
            </span>
          </Link>
        </div>
      </div>

      {/* CSS Animations */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes kenBurns {
            0% {
              transform: scale(1) translate(0, 0);
            }
            50% {
              transform: scale(1.08) translate(-1%, -0.5%);
            }
            100% {
              transform: scale(1) translate(0, 0);
            }
          }
          @keyframes waterWave {
            0%, 100% {
              transform: translateY(0px) scale(1);
            }
            50% {
              transform: translateY(-6px) scale(1.02);
            }
          }
          .animate-ken-burns {
            animation: kenBurns 16s ease-in-out infinite;
          }
          .animate-water-wave {
            animation: waterWave 7s ease-in-out infinite;
          }
        `,
        }}
      />
    </section>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";

type HeroProps = {
  bgImage?: string;
};

export default function Hero({
  bgImage = "/images/home/hero-bg.png",
}: HeroProps) {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image overlaying behind transparent Navbar */}
      <div className="absolute inset-0 w-full h-full select-none z-0">
        <Image
          src={bgImage}
          alt="Wedding Photography Background"
          fill
          priority
          quality={95}
          className="object-cover"
        />
        {/* Soft elegant overlay to darken and ensure copy contrast */}
        <div className="absolute inset-0 bg-[#0b0c10]/80 z-10" />
      </div>

      {/* Main Content Area */}
      <div className="relative z-20 flex flex-col items-center justify-center w-full max-w-[1440px] px-4 sm:px-16 lg:px-8 text-center pt-24 pb-12 select-none">
        {/* Watermark Calligraphy Text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-script text-[65px] sm:text-[120px] md:text-[160px] lg:text-[185px] text-[#BF9F72]/20 whitespace-nowrap pointer-events-none select-none z-0 leading-none">
          Wedding <br /> Photography
        </div>

        {/* Hero Headings */}
        <h1 className="text-white text-3xl sm:text-5xl md:text-6xl lg:text-7.5xl font-normal tracking-[0.02em] leading-[1.25] max-w-[950px] z-10 drop-shadow-md select-text">
          Make A Wonderful Story <br />
          For Your Wedding
        </h1>

        {/* Buttons Section */}
        <div className="flex flex-col sm:flex-row gap-5 mt-14 z-10 w-full max-w-[700px] justify-center px-4">
          <Link
            href="/"
            className="border border-[#BF9F72] bg-black/20 backdrop-blur-sm text-white hover:bg-[#BF9F72] hover:text-[#0b0c10] hover:border-[#BF9F72] transition-all duration-300 px-6 sm:px-8 py-4 text-[10px] sm:text-[11px] font-medium tracking-[0.25em] uppercase text-center flex items-center justify-center"
          >
            Book Your Wedding Photography Experience Today
          </Link>
          <Link
            href="/contact"
            className="border border-[#BF9F72] bg-black/20 backdrop-blur-sm text-[#BF9F72] hover:bg-[#BF9F72] hover:text-[#0b0c10] hover:border-[#BF9F72] transition-all duration-300 px-6 sm:px-8 py-4 text-[10px] sm:text-[11px] font-medium tracking-[0.25em] uppercase text-center flex items-center justify-center gap-3 whitespace-nowrap"
          >
            Contact Me <span>&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

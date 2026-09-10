"use client";

import LazyImage from "components/common/LazyImage";
import PortfolioGrid from "components/home/PortfolioGrid";
import Link from "next/link";
import weddingPortfolioData from "data/wedding-portfolio.json";

const WeddingPortfolio = () => {
  return (
    <div>
      {/* HERO */}
      <section className="relative w-full min-h-[70vh] sm:min-h-[85vh] flex items-center justify-center overflow-hidden bg-[#0b0c10]">
        <div className="absolute inset-0 w-full h-full select-none z-0 overflow-hidden">
          <div className="relative w-full h-full animate-wp-ken-burns">
            <LazyImage
              src={weddingPortfolioData[0].src}
              alt="Wedding photography portfolio"
              fill
              priority
              quality={95}
              className="object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-[#0b0c10]/70 z-10" />
        </div>

        <div className="relative z-20 flex flex-col items-center justify-center w-full max-w-[1440px] px-4 sm:px-16 lg:px-8 text-center pt-24 pb-12">
          <span className="text-[11px] sm:text-[12px] font-medium tracking-[0.35em] uppercase text-[#BF9F72]">
            Something Blue Florida
          </span>
          <h1 className="mt-5 text-white text-3xl sm:text-5xl md:text-6xl font-normal tracking-[0.02em] leading-[1.25] max-w-[900px] drop-shadow-md">
            Wedding Photography Portfolio
          </h1>
          <p className="mt-6 max-w-[620px] text-white/70 text-sm sm:text-base leading-relaxed">
            A curated collection of genuine moments, timeless portraits, and
            joyful celebrations captured across Florida.
          </p>

          <div className="mt-10">
            <Link
              href="/contact"
              className="border border-[#BF9F72] bg-black/20 backdrop-blur-sm text-white hover:bg-[#BF9F72] hover:text-[#0b0c10] hover:border-[#BF9F72] transition-all duration-300 px-8 py-4 text-[10px] sm:text-[11px] font-medium tracking-[0.25em] uppercase text-center inline-flex items-center justify-center cursor-pointer"
            >
              Book Your Wedding Photography Experience
            </Link>
          </div>
        </div>

        <style
          dangerouslySetInnerHTML={{
            __html: `
            @keyframes wpKenBurns {
              0% { transform: scale(1) translate(0, 0); }
              50% { transform: scale(1.08) translate(-1%, -0.5%); }
              100% { transform: scale(1) translate(0, 0); }
            }
            .animate-wp-ken-burns {
              animation: wpKenBurns 16s ease-in-out infinite;
            }
          `,
          }}
        />
      </section>

      {/* GALLERY */}
      <PortfolioGrid
        images={weddingPortfolioData}
        sectionId="wedding-gallery"
        wishlistStorageKey="wedding-portfolio-wishlist"
      />
    </div>
  );
};

export default WeddingPortfolio;

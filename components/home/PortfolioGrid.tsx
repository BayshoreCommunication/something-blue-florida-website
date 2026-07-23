"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import imagesData from "data/portfolio.json";

export default function PortfolioGrid() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const rows: string[][] = [];
  for (let i = 0; i < imagesData.length; i += 5) {
    if (i + 5 <= imagesData.length) {
      rows.push(imagesData.slice(i, i + 5));
    }
  }

  // Handle lightbox keyboard navigation
  useEffect(() => {
    if (activeIdx === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        setActiveIdx((prev) =>
          prev !== null ? (prev + 1) % imagesData.length : null,
        );
      } else if (e.key === "ArrowLeft") {
        setActiveIdx((prev) =>
          prev !== null
            ? (prev - 1 + imagesData.length) % imagesData.length
            : null,
        );
      } else if (e.key === "Escape") {
        setActiveIdx(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIdx]);

  // Lock scroll when lightbox is active
  useEffect(() => {
    if (activeIdx !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [activeIdx]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIdx((prev) =>
      prev !== null ? (prev - 1 + imagesData.length) % imagesData.length : null,
    );
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIdx((prev) =>
      prev !== null ? (prev + 1) % imagesData.length : null,
    );
  };

  return (
    <section className="bg-[#0b0c10] py-1 border-y border-black select-none overflow-hidden">
      <div className="flex flex-col gap-1">
        {rows.map((rowImages, rowIndex) => {
          const isEvenRow = rowIndex % 2 === 0;

          return (
            <div
              key={rowIndex}
              className="grid grid-cols-1 md:grid-cols-12 gap-1 w-full"
            >
              {isEvenRow ? (
                <>
                  {/* Large Left */}
                  <div className="col-span-1 md:col-span-6">
                    <div
                      onClick={() => setActiveIdx(rowIndex * 5 + 0)}
                      className="relative overflow-hidden group cursor-pointer"
                    >
                      <Image
                        src={rowImages[0]}
                        alt={`Portfolio image ${rowIndex * 5 + 1}`}
                        width={2000}
                        height={1500}
                        className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                      />
                    </div>
                  </div>

                  {/* Middle Column */}
                  <div className="col-span-1 md:col-span-3">
                    <div className="grid grid-rows-2 gap-1">
                      {[rowImages[1], rowImages[2]].map((img, i) => (
                        <div
                          key={i}
                          onClick={() => setActiveIdx(rowIndex * 5 + i + 1)}
                          className="relative overflow-hidden group cursor-pointer"
                        >
                          <Image
                            src={img}
                            alt={`Portfolio image ${rowIndex * 5 + i + 2}`}
                            width={2000}
                            height={1500}
                            className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="col-span-1 md:col-span-3">
                    <div className="grid grid-rows-2 gap-1">
                      {[rowImages[3], rowImages[4]].map((img, i) => (
                        <div
                          key={i}
                          onClick={() => setActiveIdx(rowIndex * 5 + i + 3)}
                          className="relative overflow-hidden group cursor-pointer"
                        >
                          <Image
                            src={img}
                            alt={`Portfolio image ${rowIndex * 5 + i + 4}`}
                            width={2000}
                            height={1500}
                            className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Left Column */}
                  <div className="col-span-1 md:col-span-3">
                    <div className="grid grid-rows-2 gap-1">
                      {[rowImages[0], rowImages[1]].map((img, i) => (
                        <div
                          key={i}
                          onClick={() => setActiveIdx(rowIndex * 5 + i + 0)}
                          className="relative overflow-hidden group cursor-pointer"
                        >
                          <Image
                            src={img}
                            alt={`Portfolio image ${rowIndex * 5 + i + 1}`}
                            width={2000}
                            height={1500}
                            className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Middle Column */}
                  <div className="col-span-1 md:col-span-3">
                    <div className="grid grid-rows-2 gap-1">
                      {[rowImages[2], rowImages[3]].map((img, i) => (
                        <div
                          key={i}
                          onClick={() => setActiveIdx(rowIndex * 5 + i + 2)}
                          className="relative overflow-hidden group cursor-pointer"
                        >
                          <Image
                            src={img}
                            alt={`Portfolio image ${rowIndex * 5 + i + 3}`}
                            width={2000}
                            height={1500}
                            className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Large Right */}
                  <div className="col-span-1 md:col-span-6">
                    <div
                      onClick={() => setActiveIdx(rowIndex * 5 + 4)}
                      className="relative overflow-hidden group cursor-pointer"
                    >
                      <Image
                        src={rowImages[4]}
                        alt={`Portfolio image ${rowIndex * 5 + 5}`}
                        width={2000}
                        height={1500}
                        className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* LIGHTBOX MODAL OVERLAY */}
      {activeIdx !== null && (
        <div
          onClick={() => setActiveIdx(null)}
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center transition-opacity duration-300 animate-fadeIn"
        >
          {/* Close Button */}
          <button
            onClick={() => setActiveIdx(null)}
            className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors p-3 bg-white/5 hover:bg-white/10 rounded-full z-[110]"
            aria-label="Close lightbox"
          >
            <X size={24} />
          </button>

          {/* Left Arrow Button */}
          <button
            onClick={handlePrev}
            className="absolute left-4 sm:left-6 text-white/80 hover:text-white transition-colors p-3 bg-white/5 hover:bg-white/10 rounded-full z-[110]"
            aria-label="Previous image"
          >
            <ChevronLeft size={28} />
          </button>

          {/* Image Viewer */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-[90vw] max-h-[80vh] sm:max-h-[85vh] transition-transform duration-500 transform animate-scaleIn select-none"
          >
            <img
              src={imagesData[activeIdx]}
              alt={`Selected portfolio image ${activeIdx + 1}`}
              className="max-w-full max-h-[80vh] sm:max-h-[85vh] object-contain shadow-2xl"
            />
            {/* Image Counter indicator */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-white/60 text-[13px] tracking-widest font-serif uppercase">
              {activeIdx + 1} / {imagesData.length}
            </div>
          </div>

          {/* Right Arrow Button */}
          <button
            onClick={handleNext}
            className="absolute right-4 sm:right-6 text-white/80 hover:text-white transition-colors p-3 bg-white/5 hover:bg-white/10 rounded-full z-[110]"
            aria-label="Next image"
          >
            <ChevronRight size={28} />
          </button>
        </div>
      )}

      {/* Lightbox CSS Utilities */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes scaleIn {
            from { transform: scale(0.96); }
            to { transform: scale(1); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.25s ease-out forwards;
          }
          .animate-scaleIn {
            animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          }
        `,
        }}
      />
    </section>
  );
}

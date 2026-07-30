"use client";

import { useState, useEffect, useRef } from "react";
import LazyImage from "components/common/LazyImage";
import {
  ChevronLeft,
  ChevronRight,
  X,
  ZoomIn,
  ZoomOut,
  Download,
} from "lucide-react";
import imagesData from "data/portfolio.json";
import gsap from "gsap";
import Image from "next/image";

export default function PortfolioGrid() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  // 1. Fixed constants & batch state logic
  const BATCH_SIZE = 3;

  const [visibleRowsCount, setVisibleRowsCount] = useState<number>(3);
  const [targetBatchLimit, setTargetBatchLimit] = useState<number>(3);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Lightbox Zoom & Pan (Drag) State
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panPosition, setPanPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  // Custom Cursor & Parallax Refs
  const gridSectionRef = useRef<HTMLElement | null>(null);
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const thumbnailContainerRef = useRef<HTMLDivElement | null>(null);

  // Split images into rows of 5
  const allRows: string[][] = [];
  for (let i = 0; i < imagesData.length; i += 5) {
    if (i + 5 <= imagesData.length) {
      allRows.push(imagesData.slice(i, i + 5));
    }
  }

  const visibleRows = allRows.slice(0, visibleRowsCount);
  const hasMore = visibleRowsCount < allRows.length;

  // Helper utility to convert image extensions to WebP
  const toWebP = (src: string) =>
    src.startsWith("/images/portfolio/")
      ? src.replace(/\.(jpg|jpeg|png|svg)$/i, ".webp")
      : src;

  // Reset Zoom & Pan state helper
  const resetZoomAndPan = () => {
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
  };

  // 2. Custom Magnetic Hover Cursor Logic for Grid
  useEffect(() => {
    if (!gridSectionRef.current || !cursorRef.current) return;

    const ctx = gsap.context(() => {
      const moveCursor = (e: MouseEvent) => {
        gsap.to(cursorRef.current, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.4,
          ease: "power3.out",
          overwrite: "auto",
        });
      };

      const sectionEl = gridSectionRef.current;
      if (sectionEl) {
        sectionEl.addEventListener("mousemove", moveCursor);
      }

      return () => {
        if (sectionEl) {
          sectionEl.removeEventListener("mousemove", moveCursor);
        }
      };
    }, gridSectionRef);

    return () => ctx.revert();
  }, []);

  const handleMouseEnterCard = () => {
    if (cursorRef.current) {
      gsap.to(cursorRef.current, {
        scale: 1,
        opacity: 1,
        duration: 0.35,
        ease: "power3.out",
      });
    }
  };

  const handleMouseLeaveCard = () => {
    if (cursorRef.current) {
      gsap.to(cursorRef.current, {
        scale: 0,
        opacity: 0,
        duration: 0.25,
        ease: "power2.in",
      });
    }
  };

  // 3. Observer setup for Hybrid Infinite Scroll
  useEffect(() => {
    if (isPaused || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting) {
          setVisibleRowsCount((prev) => {
            const next = prev + 1;
            if (next >= targetBatchLimit) {
              setIsPaused(true);
            }
            return Math.min(next, allRows.length);
          });
        }
      },
      {
        root: null,
        rootMargin: "200px",
        threshold: 0.1,
      },
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [isPaused, hasMore, targetBatchLimit, allRows.length]);

  const handleShowMore = () => {
    setTargetBatchLimit((prev) => prev + BATCH_SIZE);
    setIsPaused(false);
  };

  // Keyboard Navigation for Lightbox
  useEffect(() => {
    if (activeIdx === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        setActiveIdx((prev) =>
          prev !== null ? (prev + 1) % imagesData.length : null,
        );
        resetZoomAndPan();
      } else if (e.key === "ArrowLeft") {
        setActiveIdx((prev) =>
          prev !== null
            ? (prev - 1 + imagesData.length) % imagesData.length
            : null,
        );
        resetZoomAndPan();
      } else if (e.key === "Escape") {
        setActiveIdx(null);
        resetZoomAndPan();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIdx]);

  // Preload adjacent images
  useEffect(() => {
    if (activeIdx === null) return;
    const idxs = [
      activeIdx,
      (activeIdx + 1) % imagesData.length,
      (activeIdx - 1 + imagesData.length) % imagesData.length,
    ];
    idxs.forEach((i) => {
      const img = new window.Image();
      img.src = toWebP(imagesData[i]);
    });
  }, [activeIdx]);

  // Lock background scroll when lightbox is active
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

  // Scroll active thumbnail into center view
  useEffect(() => {
    if (activeIdx !== null && thumbnailContainerRef.current) {
      const activeThumb = thumbnailContainerRef.current.children[
        activeIdx
      ] as HTMLElement;
      if (activeThumb) {
        activeThumb.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [activeIdx]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIdx((prev) =>
      prev !== null ? (prev - 1 + imagesData.length) % imagesData.length : null,
    );
    resetZoomAndPan();
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIdx((prev) =>
      prev !== null ? (prev + 1) % imagesData.length : null,
    );
    resetZoomAndPan();
  };

  const handleImageDownload = (e: React.MouseEvent, imageSrc: string) => {
    e.stopPropagation();
    const link = document.createElement("a");
    link.href = toWebP(imageSrc);
    link.download = `portfolio-image-${(activeIdx ?? 0) + 1}.webp`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- PAN & DRAG HANDLERS ---
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel <= 1) return;
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - panPosition.x,
      y: e.clientY - panPosition.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || zoomLevel <= 1) return;
    setPanPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch support for Mobile Dragging
  const handleTouchStart = (e: React.TouchEvent) => {
    if (zoomLevel <= 1) return;
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({
      x: touch.clientX - panPosition.x,
      y: touch.clientY - panPosition.y,
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || zoomLevel <= 1) return;
    const touch = e.touches[0];
    setPanPosition({
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y,
    });
  };

  // Helper render method for each image card
  const renderImageCard = (imgSrc: string, globalIndex: number) => (
    <div
      onClick={() => {
        setActiveIdx(globalIndex);
        resetZoomAndPan();
      }}
      onMouseEnter={handleMouseEnterCard}
      onMouseLeave={handleMouseLeaveCard}
      className="relative overflow-hidden group cursor-none w-full h-full"
    >
      <LazyImage
        src={imgSrc}
        alt={`Portfolio image ${globalIndex + 1}`}
        width={2000}
        height={1500}
        quality={100}
        className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-108"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4 pointer-events-none">
        <span className="text-white/90 text-[11px] uppercase tracking-[0.2em] font-light">
          Story #{globalIndex + 1}
        </span>
      </div>
    </div>
  );

  return (
    <section
      ref={gridSectionRef}
      id="portfolio"
      className="bg-[#0b0c10] py-1 border-y border-black select-none overflow-hidden relative"
    >
      {/* MAGNETIC "VIEW" HOVER CURSOR */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50 scale-0 opacity-0 flex items-center justify-center w-20 h-20 rounded-full bg-[#BF9F72]/90 text-[#0b0c10] text-[11px] font-bold tracking-[0.2em] uppercase backdrop-blur-md shadow-[0_10px_30px_rgba(191,159,114,0.3)] border border-white/20 will-change-transform"
      >
        VIEW
      </div>

      <div className="flex flex-col gap-3 md:gap-1">
        {visibleRows.map((rowImages, rowIndex) => {
          const isEvenRow = rowIndex % 2 === 0;

          return (
            <div
              key={rowIndex}
              className="grid grid-cols-2 md:grid-cols-12 gap-3 md:gap-1 w-full"
            >
              {isEvenRow ? (
                <>
                  <div className="col-span-2 md:col-span-6">
                    {renderImageCard(rowImages[0], rowIndex * 5 + 0)}
                  </div>
                  <div className="col-span-1 md:col-span-3">
                    <div className="grid grid-rows-2 gap-3 md:gap-1 h-full">
                      {[rowImages[1], rowImages[2]].map((img, i) => (
                        <div key={i}>
                          {renderImageCard(img, rowIndex * 5 + i + 1)}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="col-span-1 md:col-span-3">
                    <div className="grid grid-rows-2 gap-3 md:gap-1 h-full">
                      {[rowImages[3], rowImages[4]].map((img, i) => (
                        <div key={i}>
                          {renderImageCard(img, rowIndex * 5 + i + 3)}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="col-span-1 md:col-span-3">
                    <div className="grid grid-rows-2 gap-3 md:gap-1 h-full">
                      {[rowImages[0], rowImages[1]].map((img, i) => (
                        <div key={i}>
                          {renderImageCard(img, rowIndex * 5 + i + 0)}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="col-span-1 md:col-span-3">
                    <div className="grid grid-rows-2 gap-3 md:gap-1 h-full">
                      {[rowImages[2], rowImages[3]].map((img, i) => (
                        <div key={i}>
                          {renderImageCard(img, rowIndex * 5 + i + 2)}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="col-span-2 md:col-span-6">
                    {renderImageCard(rowImages[4], rowIndex * 5 + 4)}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Batch Load Control */}
      {hasMore && (
        <div ref={loadMoreRef} className="py-8 text-center bg-[#0b0c10]">
          {isPaused || visibleRowsCount >= targetBatchLimit ? (
            <button
              onClick={handleShowMore}
              className="px-8 py-3.5 text-[12px] font-medium tracking-[0.25em] uppercase text-white bg-transparent border border-white/20 hover:border-[#BF9F72] hover:text-[#BF9F72] transition-all duration-300 cursor-pointer"
            >
              Show More Portfolio
            </button>
          ) : (
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-[#BF9F72] border-r-transparent align-[-0.125em]" />
          )}
        </div>
      )}

      {/* ADVANCED LIGHTBOX MODAL */}
      {activeIdx !== null && (
        <div
          onClick={() => {
            setActiveIdx(null);
            resetZoomAndPan();
          }}
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col items-center justify-between py-6 px-4 transition-opacity duration-300 animate-fadeIn"
        >
          {/* Top Control Bar */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-6xl flex justify-between items-center z-[120] px-4"
          >
            <div className="text-white/70 text-[12px] tracking-[0.2em] font-serif uppercase">
              {activeIdx + 1} / {imagesData.length}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setZoomLevel((prev) => {
                    const next = Math.min(prev + 0.5, 3);
                    if (next === 1) setPanPosition({ x: 0, y: 0 });
                    return next;
                  });
                }}
                className="text-white/80 hover:text-white p-2.5 bg-white/5 hover:bg-white/10 rounded-full transition-colors"
                title="Zoom In"
              >
                <ZoomIn size={18} />
              </button>
              <button
                onClick={() => {
                  setZoomLevel((prev) => {
                    const next = Math.max(prev - 0.5, 1);
                    if (next === 1) setPanPosition({ x: 0, y: 0 });
                    return next;
                  });
                }}
                className="text-white/80 hover:text-white p-2.5 bg-white/5 hover:bg-white/10 rounded-full transition-colors"
                title="Zoom Out"
              >
                <ZoomOut size={18} />
              </button>
              <button
                onClick={(e) => handleImageDownload(e, imagesData[activeIdx])}
                className="text-white/80 hover:text-[#BF9F72] p-2.5 bg-white/5 hover:bg-white/10 rounded-full transition-colors"
                title="Download High Res Image"
              >
                <Download size={18} />
              </button>
              <button
                onClick={() => {
                  setActiveIdx(null);
                  resetZoomAndPan();
                }}
                className="text-white/80 hover:text-white p-2.5 bg-white/5 hover:bg-white/10 rounded-full transition-colors ml-2"
                aria-label="Close lightbox"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Left Navigation Arrow */}
          <button
            onClick={handlePrev}
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition-colors p-3 bg-white/5 hover:bg-white/10 rounded-full z-[110]"
            aria-label="Previous image"
          >
            <ChevronLeft size={28} />
          </button>

          {/* Main Focused Image Container (WITH GRAB / DRAG FUNCTIONALITY) */}
          <div
            onClick={(e) => e.stopPropagation()}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUp}
            className={`relative my-auto max-w-[90vw] max-h-[70vh] sm:max-h-[75vh] flex items-center justify-center overflow-hidden select-none ${
              zoomLevel > 1
                ? isDragging
                  ? "cursor-grabbing"
                  : "cursor-grab"
                : "cursor-default"
            }`}
          >
            <Image
              src={toWebP(imagesData[activeIdx])}
              alt={`Selected portfolio image ${activeIdx + 1}`}
              style={{
                transform: `scale(${zoomLevel}) translate(${panPosition.x / zoomLevel}px, ${
                  panPosition.y / zoomLevel
                }px)`,
              }}
              className={`max-w-full max-h-[70vh] sm:max-h-[75vh] object-contain shadow-2xl ${
                isDragging
                  ? "transition-none"
                  : "transition-transform duration-200 ease-out"
              }`}
            />
          </div>

          {/* Right Navigation Arrow */}
          <button
            onClick={handleNext}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition-colors p-3 bg-white/5 hover:bg-white/10 rounded-full z-[110]"
            aria-label="Next image"
          >
            <ChevronRight size={28} />
          </button>

          {/* Bottom Interactive Thumbnail Strip */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl z-[120] overflow-hidden py-2 px-4"
          >
            <div
              ref={thumbnailContainerRef}
              className="flex gap-2 overflow-x-auto no-scrollbar scroll-smooth justify-start sm:justify-center items-center py-1"
            >
              {imagesData.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveIdx(idx);
                    resetZoomAndPan();
                  }}
                  className={`relative flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-md overflow-hidden border-2 transition-all duration-300 ${
                    activeIdx === idx
                      ? "border-[#BF9F72] scale-105 opacity-100"
                      : "border-transparent opacity-40 hover:opacity-80"
                  }`}
                >
                  <Image
                    src={toWebP(img)}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
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
          .animate-fadeIn {
            animation: fadeIn 0.25s ease-out forwards;
          }
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `,
        }}
      />
    </section>
  );
}

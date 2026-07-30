"use client";

import { useState, useEffect, useRef, useMemo } from "react";
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

// Category definitions
const CATEGORIES = [
  "ALL",
  "WEDDINGS",
  "PORTRAITS",
  "COUPLES",
  "EVENTS",
] as const;
type Category = (typeof CATEGORIES)[number];

export default function PortfolioGrid() {
  const [activeCategory, setActiveCategory] = useState<Category>("ALL");
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  // 1. Dynamic Category Assignment Logic from raw string array JSON
  const categorizedImages = useMemo(() => {
    const categoriesList: Category[] = [
      "WEDDINGS",
      "PORTRAITS",
      "COUPLES",
      "EVENTS",
    ];
    return imagesData.map((src, index) => {
      const category = categoriesList[index % categoriesList.length];
      return { src, category, originalIndex: index };
    });
  }, []);

  // Filtered dataset based on active tab
  const filteredData = useMemo(() => {
    if (activeCategory === "ALL") return categorizedImages;
    return categorizedImages.filter((item) => item.category === activeCategory);
  }, [activeCategory, categorizedImages]);

  // 2. Fixed constants & batch state logic
  const BATCH_SIZE = 3;
  const [visibleRowsCount, setVisibleRowsCount] = useState<number>(3);
  const [targetBatchLimit, setTargetBatchLimit] = useState<number>(3);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Reset batching state whenever category changes
  useEffect(() => {
    setVisibleRowsCount(3);
    setTargetBatchLimit(3);
    setIsPaused(false);
  }, [activeCategory]);

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

  // Custom Cursor & Refs
  const gridSectionRef = useRef<HTMLElement | null>(null);
  const gridRowsContainerRef = useRef<HTMLDivElement | null>(null);
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const thumbnailContainerRef = useRef<HTMLDivElement | null>(null);

  // Split filtered images into rows of 5
  const allRows = useMemo(() => {
    const rows: Array<typeof filteredData> = [];
    for (let i = 0; i < filteredData.length; i += 5) {
      if (i + 5 <= filteredData.length) {
        rows.push(filteredData.slice(i, i + 5));
      } else {
        // Handle remaining items gracefully
        rows.push(filteredData.slice(i));
      }
    }
    return rows;
  }, [filteredData]);

  const visibleRows = allRows.slice(0, visibleRowsCount);
  const hasMore = visibleRowsCount < allRows.length;

  // GSAP Animation when active category changes
  const handleCategoryChange = (cat: Category) => {
    if (cat === activeCategory) return;
    if (gridRowsContainerRef.current) {
      gsap.fromTo(
        gridRowsContainerRef.current,
        { opacity: 0.3, y: 15 },
        { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" },
      );
    }
    setActiveCategory(cat);
  };

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

  // 3. Custom Magnetic Hover Cursor Logic
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

  // 4. Observer setup for Hybrid Infinite Scroll
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
          prev !== null ? (prev + 1) % filteredData.length : null,
        );
        resetZoomAndPan();
      } else if (e.key === "ArrowLeft") {
        setActiveIdx((prev) =>
          prev !== null
            ? (prev - 1 + filteredData.length) % filteredData.length
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
  }, [activeIdx, filteredData.length]);

  // Preload adjacent images
  useEffect(() => {
    if (activeIdx === null) return;
    const idxs = [
      activeIdx,
      (activeIdx + 1) % filteredData.length,
      (activeIdx - 1 + filteredData.length) % filteredData.length,
    ];
    idxs.forEach((i) => {
      const img = new window.Image();
      img.src = toWebP(filteredData[i].src);
    });
  }, [activeIdx, filteredData]);

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
      prev !== null
        ? (prev - 1 + filteredData.length) % filteredData.length
        : null,
    );
    resetZoomAndPan();
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIdx((prev) =>
      prev !== null ? (prev + 1) % filteredData.length : null,
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
  const renderImageCard = (
    item: (typeof filteredData)[number],
    gridIndex: number,
  ) => {
    if (!item) return null;
    return (
      <div
        onClick={() => {
          setActiveIdx(gridIndex);
          resetZoomAndPan();
        }}
        onMouseEnter={handleMouseEnterCard}
        onMouseLeave={handleMouseLeaveCard}
        className="relative overflow-hidden group cursor-none w-full h-full min-h-[220px]"
      >
        <LazyImage
          src={item.src}
          alt={`Portfolio image ${gridIndex + 1}`}
          width={2000}
          height={1500}
          quality={100}
          className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-108 w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex justify-between items-end p-4 pointer-events-none">
          <span className="text-white/90 text-[11px] uppercase tracking-[0.2em] font-light">
            Story #{item.originalIndex + 1}
          </span>
          <span className="text-[#BF9F72] text-[10px] uppercase tracking-[0.15em] font-medium border border-[#BF9F72]/40 px-2 py-0.5 rounded-sm bg-black/40 backdrop-blur-sm">
            {item.category}
          </span>
        </div>
      </div>
    );
  };

  return (
    <section
      ref={gridSectionRef}
      id="portfolio"
      className="bg-[#0b0c10] py-8 border-y border-black select-none overflow-hidden relative"
    >
      {/* MAGNETIC "VIEW" HOVER CURSOR */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50 scale-0 opacity-0 flex items-center justify-center w-20 h-20 rounded-full bg-[#BF9F72]/90 text-[#0b0c10] text-[11px] font-bold tracking-[0.2em] uppercase backdrop-blur-md shadow-[0_10px_30px_rgba(191,159,114,0.3)] border border-white/20 will-change-transform"
      >
        VIEW
      </div>

      {/* FILTER / CATEGORY TABS BAR */}
      <div className="max-w-6xl mx-auto px-4 mb-8 flex flex-wrap justify-center items-center gap-3 sm:gap-6 z-20 relative">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`px-5 py-2 text-[11px] sm:text-[12px] font-medium tracking-[0.25em] uppercase transition-all duration-300 relative cursor-pointer ${
              activeCategory === cat
                ? "text-[#BF9F72]"
                : "text-white/60 hover:text-white"
            }`}
          >
            {cat}
            {activeCategory === cat && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#BF9F72] animate-fadeIn" />
            )}
          </button>
        ))}
      </div>

      {/* GRID ROWS CONTAINER */}
      <div ref={gridRowsContainerRef} className="flex flex-col gap-3 md:gap-1">
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
                      {[rowImages[1], rowImages[2]].map(
                        (img, i) =>
                          img && (
                            <div key={i}>
                              {renderImageCard(img, rowIndex * 5 + i + 1)}
                            </div>
                          ),
                      )}
                    </div>
                  </div>
                  <div className="col-span-1 md:col-span-3">
                    <div className="grid grid-rows-2 gap-3 md:gap-1 h-full">
                      {[rowImages[3], rowImages[4]].map(
                        (img, i) =>
                          img && (
                            <div key={i}>
                              {renderImageCard(img, rowIndex * 5 + i + 3)}
                            </div>
                          ),
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="col-span-1 md:col-span-3">
                    <div className="grid grid-rows-2 gap-3 md:gap-1 h-full">
                      {[rowImages[0], rowImages[1]].map(
                        (img, i) =>
                          img && (
                            <div key={i}>
                              {renderImageCard(img, rowIndex * 5 + i + 0)}
                            </div>
                          ),
                      )}
                    </div>
                  </div>
                  <div className="col-span-1 md:col-span-3">
                    <div className="grid grid-rows-2 gap-3 md:gap-1 h-full">
                      {[rowImages[2], rowImages[3]].map(
                        (img, i) =>
                          img && (
                            <div key={i}>
                              {renderImageCard(img, rowIndex * 5 + i + 2)}
                            </div>
                          ),
                      )}
                    </div>
                  </div>
                  <div className="col-span-2 md:col-span-6">
                    {rowImages[4] &&
                      renderImageCard(rowImages[4], rowIndex * 5 + 4)}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Batch Load Control */}
      {hasMore && (
        <div ref={loadMoreRef} className="pt-8 text-center bg-[#0b0c10]">
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
      {activeIdx !== null && filteredData[activeIdx] && (
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
              {activeIdx + 1} / {filteredData.length}
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
                onClick={(e) =>
                  handleImageDownload(e, filteredData[activeIdx].src)
                }
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

          {/* Main Focused Image Container */}
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
              src={toWebP(filteredData[activeIdx].src)}
              alt={`Selected portfolio image ${activeIdx + 1}`}
              width={2000}
              height={1500}
              style={{
                transform: `scale(${zoomLevel}) translate(${
                  panPosition.x / zoomLevel
                }px, ${panPosition.y / zoomLevel}px)`,
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
              {filteredData.map((item, idx) => (
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
                    src={toWebP(item.src)}
                    alt={`Thumbnail ${idx + 1}`}
                    width={100}
                    height={100}
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

"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import LazyImage from "components/common/LazyImage";
import {
  ChevronLeft,
  ChevronRight,
  X,
  ZoomIn,
  ZoomOut,
  Heart,
  Share2,
  Link as LinkIcon,
  Mail,
  Check,
} from "lucide-react";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaWhatsapp,
  FaXTwitter,
} from "react-icons/fa6";
import imagesData from "data/portfolio.json";

interface PortfolioItem {
  src: string;
  width: number;
  height: number;
}

export default function PortfolioGrid() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [wishlistItems, setWishlistItems] = useState<number[]>([]);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isLinkCopied, setIsLinkCopied] = useState(false);

  const filteredData = useMemo(() => {
    return (imagesData as PortfolioItem[]).map((item, index) => ({
      ...item,
      originalIndex: index,
    }));
  }, []);

  // 2. Fixed constants & batch state logic
  const BATCH_SIZE = 3;
  const [visibleRowsCount, setVisibleRowsCount] = useState<number>(3);
  const [targetBatchLimit, setTargetBatchLimit] = useState<number>(3);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  useEffect(() => {
    try {
      const savedItems = window.localStorage.getItem("portfolio-wishlist");
      if (savedItems) setWishlistItems(JSON.parse(savedItems));
    } catch {
      // Ignore unavailable or invalid local storage data.
    }
  }, []);

  // Lightbox Zoom & Pan (Drag) State
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [activeImageAspect, setActiveImageAspect] = useState(4 / 3);
  const [panPosition, setPanPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  // Element refs
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const openShareOnNextImageRef = useRef(false);

  // Split filtered images into rows of 5
  const allRows = useMemo(() => {
    const rows: Array<typeof filteredData> = [];
    for (let i = 0; i < filteredData.length; i += 5) {
      if (i + 5 <= filteredData.length) {
        rows.push(filteredData.slice(i, i + 5));
      } else {
        rows.push(filteredData.slice(i));
      }
    }
    return rows;
  }, [filteredData]);

  const visibleRows = allRows.slice(0, visibleRowsCount);
  const hasMore = visibleRowsCount < allRows.length;

  // Reset Zoom & Pan state helper
  const resetZoomAndPan = () => {
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
  };

  const toggleWishlist = (itemIndex: number) => {
    setWishlistItems((currentItems) => {
      const nextItems = currentItems.includes(itemIndex)
        ? currentItems.filter((index) => index !== itemIndex)
        : [...currentItems, itemIndex];

      try {
        window.localStorage.setItem(
          "portfolio-wishlist",
          JSON.stringify(nextItems),
        );
      } catch {
        // Wishlist still works for this session if storage is unavailable.
      }

      return nextItems;
    });
  };

  const getShareUrl = () => {
    const url = new URL(window.location.href);
    url.hash = "portfolio";
    return url.toString();
  };

  const openShareWindow = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer,width=720,height=620");
  };

  const copyShareLink = async () => {
    await navigator.clipboard.writeText(getShareUrl());
    setIsLinkCopied(true);
    window.setTimeout(() => setIsLinkCopied(false), 2000);
  };

  const shareWithDevice = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "Something Blue Wedding Photography",
        text: "View this wedding photograph from Something Blue.",
        url: getShareUrl(),
      });
      return;
    }

    await copyShareLink();
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
      img.src = `/_next/image?url=${encodeURIComponent(
        filteredData[i].src,
      )}&w=3840&q=100`;
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

  useEffect(() => {
    setIsLinkCopied(false);
    setActiveImageAspect(4 / 3);

    if (openShareOnNextImageRef.current && activeIdx !== null) {
      openShareOnNextImageRef.current = false;
      setIsShareModalOpen(true);
    } else {
      setIsShareModalOpen(false);
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
        className="relative z-0 overflow-hidden group cursor-pointer w-full h-full min-h-[220px] bg-[#d8d4ce] transition-transform duration-300 ease-out hover:z-10 hover:scale-[0.97]"
      >
        <LazyImage
          src={item.src}
          alt={`Portfolio image ${gridIndex + 1}`}
          width={item.width}
          height={item.height}
          sizes="(max-width: 767px) 100vw, 50vw"
          quality={95}
          className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-[1.12] w-full h-full"
        />

        <div className="pointer-events-none absolute inset-0 flex items-end justify-between p-3 opacity-0 transition-opacity duration-300 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100 sm:p-4">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(item.originalIndex);
            }}
            className={`flex h-9 w-9 flex-none items-center justify-center drop-shadow-[0_2px_5px_rgba(0,0,0,0.9)] transition-colors sm:h-10 sm:w-10 ${
              wishlistItems.includes(item.originalIndex)
                ? "text-[#BF9F72]"
                : "text-white hover:text-[#BF9F72]"
            }`}
            aria-label={
              wishlistItems.includes(item.originalIndex)
                ? "Remove image from wishlist"
                : "Add image to wishlist"
            }
            title="Wishlist"
          >
            <Heart
              size={17}
              fill={
                wishlistItems.includes(item.originalIndex)
                  ? "currentColor"
                  : "none"
              }
            />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openShareOnNextImageRef.current = true;
              setActiveIdx(gridIndex);
              resetZoomAndPan();
            }}
            className="flex h-9 w-9 flex-none items-center justify-center text-white drop-shadow-[0_2px_5px_rgba(0,0,0,0.9)] transition-colors hover:text-[#BF9F72] sm:h-10 sm:w-10"
            aria-label={`Share portfolio image ${gridIndex + 1}`}
            title="Share"
          >
            <Share2 size={17} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <section
      id="portfolio"
      onContextMenu={(e) => e.preventDefault()}
      className="bg-[#0b0c10] py-8 border-y border-black select-none overflow-hidden relative"
    >
      {/* GRID ROWS CONTAINER */}
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
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col items-center justify-start py-6 px-4 transition-opacity duration-300 animate-fadeIn"
        >
          {/* Top Control Bar */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-6xl flex justify-between items-center z-[120] px-4"
          >
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  toggleWishlist(filteredData[activeIdx].originalIndex)
                }
                className={`rounded-full bg-white/5 p-2.5 transition-colors hover:bg-white/10 ${
                  wishlistItems.includes(filteredData[activeIdx].originalIndex)
                    ? "text-[#BF9F72]"
                    : "text-white/80 hover:text-white"
                }`}
                aria-label={
                  wishlistItems.includes(filteredData[activeIdx].originalIndex)
                    ? "Remove image from wishlist"
                    : "Add image to wishlist"
                }
                title="Wishlist"
              >
                <Heart
                  size={18}
                  fill={
                    wishlistItems.includes(
                      filteredData[activeIdx].originalIndex,
                    )
                      ? "currentColor"
                      : "none"
                  }
                />
              </button>
              <button
                type="button"
                onClick={() => setIsShareModalOpen(true)}
                className="rounded-full bg-white/5 p-2.5 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Share image"
                title="Share"
              >
                <Share2 size={18} />
              </button>
              <div className="hidden font-serif text-[12px] uppercase tracking-[0.2em] text-white/70 sm:block">
                {activeIdx + 1} / {filteredData.length}
              </div>
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
            style={{
              width: `min(94vw, ${84 * activeImageAspect}vh)`,
              height: `min(84vh, ${94 / activeImageAspect}vw)`,
            }}
            className={`relative my-auto flex flex-none items-center justify-center overflow-hidden select-none shadow-2xl ${
              zoomLevel > 1
                ? isDragging
                  ? "cursor-grabbing"
                  : "cursor-grab"
                : "cursor-default"
            }`}
          >
            <LazyImage
              src={filteredData[activeIdx].src}
              alt={`Selected portfolio image ${activeIdx + 1}`}
              fill
              sizes={zoomLevel > 1 ? "300vw" : "100vw"}
              quality={100}
              priority
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
              onLoad={(e) => {
                const { naturalWidth, naturalHeight } = e.currentTarget;
                if (naturalWidth && naturalHeight) {
                  setActiveImageAspect(naturalWidth / naturalHeight);
                }
              }}
              style={{
                transform: `scale(${zoomLevel}) translate(${
                  panPosition.x / zoomLevel
                }px, ${panPosition.y / zoomLevel}px)`,
              }}
              className={`photo-protected object-contain ${
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

          {isShareModalOpen && (
            <div
              className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
              onClick={(e) => {
                e.stopPropagation();
                setIsShareModalOpen(false);
              }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="share-modal-title"
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-md rounded-2xl border border-white/15 bg-[#15161a] p-6 text-white shadow-2xl sm:p-8"
              >
                <button
                  type="button"
                  onClick={() => setIsShareModalOpen(false)}
                  className="absolute right-4 top-4 rounded-full p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                  aria-label="Close share options"
                >
                  <X size={19} />
                </button>

                <h2
                  id="share-modal-title"
                  className="pr-10 font-serif text-2xl font-normal tracking-wide"
                >
                  Share this moment
                </h2>
                <p className="mt-2 text-sm text-white/55">
                  Choose where you would like to share this portfolio.
                </p>

                <div className="mt-7 grid grid-cols-4 gap-4">
                  <button
                    type="button"
                    onClick={() =>
                      openShareWindow(
                        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getShareUrl())}`,
                      )
                    }
                    className="group flex flex-col items-center gap-2 text-xs text-white/65 hover:text-white"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1877F2] text-white transition-transform group-hover:scale-105">
                      <FaFacebookF size={19} />
                    </span>
                    Facebook
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      openShareWindow(
                        `https://wa.me/?text=${encodeURIComponent(`Something Blue Wedding Photography ${getShareUrl()}`)}`,
                      )
                    }
                    className="group flex flex-col items-center gap-2 text-xs text-white/65 hover:text-white"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white transition-transform group-hover:scale-105">
                      <FaWhatsapp size={21} />
                    </span>
                    WhatsApp
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      openShareWindow(
                        `https://twitter.com/intent/tweet?text=${encodeURIComponent("Something Blue Wedding Photography")}&url=${encodeURIComponent(getShareUrl())}`,
                      )
                    }
                    className="group flex flex-col items-center gap-2 text-xs text-white/65 hover:text-white"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-white ring-1 ring-white/20 transition-transform group-hover:scale-105">
                      <FaXTwitter size={19} />
                    </span>
                    X
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      openShareWindow(
                        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getShareUrl())}`,
                      )
                    }
                    className="group flex flex-col items-center gap-2 text-xs text-white/65 hover:text-white"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0A66C2] text-white transition-transform group-hover:scale-105">
                      <FaLinkedinIn size={20} />
                    </span>
                    LinkedIn
                  </button>

                  <a
                    href={`mailto:?subject=${encodeURIComponent("Something Blue Wedding Photography")}&body=${encodeURIComponent(`View this wedding portfolio: ${getShareUrl()}`)}`}
                    className="group flex flex-col items-center gap-2 text-xs text-white/65 hover:text-white"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#BF9F72] text-[#0b0c10] transition-transform group-hover:scale-105">
                      <Mail size={20} />
                    </span>
                    Email
                  </a>

                  <button
                    type="button"
                    onClick={shareWithDevice}
                    className="group flex flex-col items-center gap-2 text-xs text-white/65 hover:text-white"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-transform group-hover:scale-105">
                      <Share2 size={20} />
                    </span>
                    More
                  </button>

                  <button
                    type="button"
                    onClick={copyShareLink}
                    className="group col-span-2 flex items-center justify-center gap-3 rounded-full border border-white/15 bg-white/5 px-4 text-sm text-white/75 transition-colors hover:border-[#BF9F72]/60 hover:text-white"
                  >
                    {isLinkCopied ? (
                      <Check size={18} className="text-[#BF9F72]" />
                    ) : (
                      <LinkIcon size={18} />
                    )}
                    {isLinkCopied ? "Link copied" : "Copy link"}
                  </button>
                </div>
              </div>
            </div>
          )}

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
        `,
        }}
      />
    </section>
  );
}

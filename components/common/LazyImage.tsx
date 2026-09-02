"use client";

import Image, { ImageProps } from "next/image";
import { useEffect, useState } from "react";

type LazyImageProps = ImageProps & {
  /** Set false to skip the loading skeleton (e.g. above-the-fold priority images). */
  showSkeleton?: boolean;
};

export default function LazyImage({
  className,
  onLoad,
  alt,
  src,
  priority = false,
  loading,
  showSkeleton = true,
  ...rest
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(!showSkeleton);

  // Reset the skeleton whenever the image source changes (e.g. lightbox navigation).
  useEffect(() => {
    setIsLoaded(!showSkeleton);
  }, [src, showSkeleton]);

  return (
    <>
      {showSkeleton && (
        <span
          aria-hidden="true"
          className={`image-skeleton absolute inset-0 transition-opacity duration-500 ease-out ${
            isLoaded ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        />
      )}
      <Image
        alt={alt}
        src={src}
        {...rest}
        priority={priority}
        loading={priority ? undefined : (loading ?? "lazy")}
        draggable={false}
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
        className={`${className || ""} photo-enhanced photo-protected ${
          showSkeleton
            ? `transition-opacity duration-500 ease-out ${isLoaded ? "opacity-100" : "opacity-0"}`
            : ""
        }`}
        onLoad={(e) => {
          setIsLoaded(true);
          onLoad?.(e);
        }}
      />
    </>
  );
}

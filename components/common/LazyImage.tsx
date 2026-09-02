"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";
import imagePlaceholders from "data/image-placeholders.json";

const placeholderMap = imagePlaceholders as Record<string, string>;

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
  placeholder,
  blurDataURL,
  ...rest
}: LazyImageProps) {
  const srcKey =
    typeof src === "string"
      ? src
      : "default" in src
        ? src.default.src
        : src.src;
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const isLoaded = !showSkeleton || loadedSrc === srcKey;
  const generatedBlurDataURL =
    typeof src === "string" ? placeholderMap[src] : undefined;
  const resolvedBlurDataURL = blurDataURL ?? generatedBlurDataURL;

  return (
    <Image
      alt={alt}
      src={src}
      {...rest}
      priority={priority}
      loading={priority ? undefined : (loading ?? "lazy")}
      placeholder={
        placeholder ??
        (showSkeleton && resolvedBlurDataURL ? "blur" : "empty")
      }
      blurDataURL={resolvedBlurDataURL}
      draggable={false}
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
      className={`${className || ""} photo-enhanced photo-protected ${
        isLoaded ? "photo-loaded" : "photo-loading"
      }`}
      onLoad={(event) => {
        setLoadedSrc(srcKey);
        onLoad?.(event);
      }}
    />
  );
}

"use client";

import Image, { ImageProps } from "next/image";

export default function LazyImage({
  className,
  onLoad,
  alt,
  src,
  priority = false,
  loading,
  ...rest
}: ImageProps) {
  const webpSrc = typeof src === "string" && src.startsWith("/images/portfolio/")
    ? src.replace(/\.(svg|png|jpg|jpeg)$/i, ".webp")
    : src;

  return (
    <Image
      alt={alt}
      src={webpSrc}
      {...rest}
      priority={priority}
      loading={priority ? undefined : (loading ?? "lazy")}
      draggable={false}
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
      className={`${className || ""} image-skeleton photo-enhanced photo-protected`}
      onLoad={onLoad}
    />
  );
}

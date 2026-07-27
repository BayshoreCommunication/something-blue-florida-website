"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";

export default function LazyImage({ className, onLoad, alt, src, ...rest }: ImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  const webpSrc = typeof src === "string" && src.startsWith("/images/portfolio/")
    ? src.replace(/\.(svg|png|jpg|jpeg)$/i, ".webp")
    : src;

  return (
    <Image
      alt={alt}
      src={webpSrc}
      {...rest}
      priority={true}
      className={`${className || ""} photo-enhanced transition-opacity duration-300 ease-out ${
        isLoaded 
          ? "opacity-100" 
          : "opacity-0"
      }`}
      onLoad={(e) => {
        setIsLoaded(true);
        if (onLoad) {
          onLoad(e);
        }
      }}
    />
  );
}

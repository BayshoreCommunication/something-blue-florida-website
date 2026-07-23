"use client";

import { NextUIProvider } from "@nextui-org/react";
import { useEffect } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));

    // Initialize with base reveal class and direction modifiers
    for (const el of elements) {
      const direction = (el.getAttribute("data-reveal") || "up").toLowerCase();
      el.classList.add("reveal");
      switch (direction) {
        case "down":
          el.classList.add("reveal-down");
          break;
        case "left":
          el.classList.add("reveal-left");
          break;
        case "right":
          el.classList.add("reveal-right");
          break;
        case "fade":
          el.classList.add("reveal-fade");
          break;
        default:
          el.classList.add("reveal-up");
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        }
      },
      { root: null, rootMargin: "0px", threshold: 0.15 }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return <NextUIProvider>{children}</NextUIProvider>;
}

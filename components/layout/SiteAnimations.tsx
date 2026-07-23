"use client";

import { RefObject, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type SiteAnimationsProps = {
  rootRef: RefObject<HTMLElement>;
};

function isReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isFillImage(image: HTMLImageElement) {
  return image.style.position === "absolute";
}

function isHandledByMotion(element: Element) {
  return Boolean(
    element.closest(".dxg-motion") || element.classList.contains("dxg-motion")
  );
}

export default function SiteAnimations({ rootRef }: SiteAnimationsProps) {
  useEffect(() => {
    const root = rootRef.current;

    if (!root || isReducedMotion()) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
      const cards = gsap.utils
        .toArray<HTMLElement>(
          "article, section .grid > div[class*='rounded'], section .grid > a[class*='rounded']",
          root
        )
        .filter(
          (card) => !card.closest(".marquee-track") && !isHandledByMotion(card)
        );

      cards.forEach((card, index) => {
        gsap.from(card, {
          autoAlpha: 0,
          y: 36,
          filter: "blur(10px)",
          duration: 0.9,
          delay: Math.min((index % 4) * 0.07, 0.21),
          ease: "expo.out",
          clearProps: "filter,transform",
          scrollTrigger: {
            trigger: card,
            start: "top 88%",
            once: true,
          },
        });
      });

      const images = gsap.utils
        .toArray<HTMLImageElement>("section img", root)
        .filter(
          (image) =>
            !isFillImage(image) &&
            !image.closest(".marquee-track") &&
            !image.closest("button") &&
            !isHandledByMotion(image)
        );

      images.forEach((image) => {
        const frame = image.parentElement;

        if (frame) {
          frame.classList.add("site-image-reveal");
        }

        gsap
          .timeline({
            scrollTrigger: {
              trigger: frame ?? image,
              start: "top 88%",
              once: true,
            },
          })
          .fromTo(
            frame ?? image,
            { clipPath: "inset(0 100% 0 0)" },
            {
              clipPath: "inset(0 0% 0 0)",
              duration: 1.05,
              ease: "power4.out",
              clearProps: "clipPath",
            }
          )
          .from(
            image,
            {
              scale: 1.12,
              duration: 1.2,
              ease: "power4.out",
              clearProps: "transform",
            },
            0
          );
      });

      const contentBlocks = gsap.utils
        .toArray<HTMLElement>(
          "section h1, section h2, section h3, section p, section li, section a.btn-primary, section a.btn-outline",
          root
        )
        .filter(
          (block) =>
            !block.closest(".marquee-track") &&
            !block.closest(".typing-title") &&
            !block.closest("article") &&
            !isHandledByMotion(block)
        );

      contentBlocks.forEach((block, index) => {
        gsap.from(block, {
          autoAlpha: 0,
          y: 18,
          duration: 0.75,
          delay: Math.min((index % 5) * 0.035, 0.14),
          ease: "power3.out",
          clearProps: "transform",
          scrollTrigger: {
            trigger: block,
            start: "top 88%",
            once: true,
          },
        });
      });

      const splitBlocks = gsap.utils.toArray<HTMLElement>(
        "section .grid > div:not([class*='rounded'])",
        root
      );

      splitBlocks.forEach((block, index) => {
        if (
          block.closest(".marquee-track") ||
          block.querySelector("section") ||
          isHandledByMotion(block)
        ) {
          return;
        }

        gsap.from(block, {
          autoAlpha: 0,
          x: index % 2 === 0 ? -22 : 22,
          filter: "blur(8px)",
          duration: 0.9,
          ease: "expo.out",
          clearProps: "filter,transform",
          scrollTrigger: {
            trigger: block,
            start: "top 88%",
            once: true,
          },
        });
      });
    }, root);

    return () => context.revert();
  }, [rootRef]);

  return null;
}

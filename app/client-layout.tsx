"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SiteAnimations from "components/layout/SiteAnimations";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    ScrollTrigger.config({
      ignoreMobileResize: true,
      autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
    });
  }, []);

  return (
    <main ref={contentRef} className="site-animated-content">
      {children}
      <SiteAnimations rootRef={contentRef} />
    </main>
  );
}

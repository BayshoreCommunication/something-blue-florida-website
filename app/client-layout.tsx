"use client";

import { useRef } from "react";
import SiteAnimations from "components/layout/SiteAnimations";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <main ref={contentRef} className="site-animated-content">
      {children}
      <SiteAnimations rootRef={contentRef} />
    </main>
  );
}

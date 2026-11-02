"use client";

import { useEffect } from "react";
import { trackEmailClick, trackPhoneClick } from "lib/tracking";

// Counts taps on any phone (tel:) or email (mailto:) link on the site.
export default function ContactClickTracker() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.("a[href]");
      const href = link?.getAttribute("href") ?? "";
      if (href.startsWith("tel:")) trackPhoneClick();
      // "mailto:?subject=…" is the portfolio share button, not a contact.
      else if (href.startsWith("mailto:") && !href.startsWith("mailto:?")) {
        trackEmailClick();
      }
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}

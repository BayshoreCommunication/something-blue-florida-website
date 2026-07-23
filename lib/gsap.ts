import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

/**
 * Register plugin ONLY in browser
 * Prevents SSR & double-registration issues
 */
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };

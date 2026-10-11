"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { CustomEase } from "gsap/CustomEase";

// Module-level registration — runs once, not inside useEffect
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, CustomEase);

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

"use client";

import { useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Preloader from "./Preloader";
import PageTransition from "./PageTransition";
import SmoothScroll from "./SmoothScroll";
import MagneticCursor from "./MagneticCursor";
import { ReadyContext } from "./ReadyContext";

export default function ClientRoot({ children }: { children: React.ReactNode }) {
  const [preloaderDone, setPreloaderDone] = useState(false);

  function handlePreloaderComplete() {
    setPreloaderDone(true);
    // Allow React to re-render and unmount the Preloader (DOM shift),
    // then recalculate all ScrollTrigger positions.
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 0);
  }

  return (
    <ReadyContext.Provider value={preloaderDone}>
      {!preloaderDone && (
        <Preloader onComplete={handlePreloaderComplete} />
      )}
      <SmoothScroll>
        <MagneticCursor />
        <PageTransition isReady={preloaderDone}>
          <div className="relative z-0">{children}</div>
        </PageTransition>
      </SmoothScroll>
    </ReadyContext.Provider>
  );
}

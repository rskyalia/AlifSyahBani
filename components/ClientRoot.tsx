"use client";

import { useState } from "react";
import Preloader from "./Preloader";
import PageTransition from "./PageTransition";
import SmoothScroll from "./SmoothScroll";
import { ReadyContext } from "./ReadyContext";

export default function ClientRoot({ children }: { children: React.ReactNode }) {
  const [preloaderDone, setPreloaderDone] = useState(false);

  return (
    <ReadyContext.Provider value={preloaderDone}>
      {!preloaderDone && (
        <Preloader onComplete={() => setPreloaderDone(true)} />
      )}
      <SmoothScroll>
        <PageTransition isReady={preloaderDone}>
          <div className="relative z-0">{children}</div>
        </PageTransition>
      </SmoothScroll>
    </ReadyContext.Provider>
  );
}

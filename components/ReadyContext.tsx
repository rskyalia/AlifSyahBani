"use client";

import { createContext, useContext } from "react";

export const ReadyContext = createContext(false);

export function useReady() {
  return useContext(ReadyContext);
}

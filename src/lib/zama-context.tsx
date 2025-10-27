"use client";

import { createContext, useContext } from "react";

export type ZamaStatus = {
  ready: boolean;
  error: string;
};

export const ZamaStatusContext = createContext<ZamaStatus>({ ready: false, error: "" });

export function useZamaStatus(): ZamaStatus {
  return useContext(ZamaStatusContext);
}



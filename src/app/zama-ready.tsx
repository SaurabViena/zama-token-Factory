"use client";

import { useZamaStatus } from "@/lib/zama-context";

export default function ZamaReadyBadge() {
  const { ready, error } = useZamaStatus();
  const color = error ? "bg-red-500" : ready ? "bg-emerald-500" : "bg-amber-500";
  const text = error ? "FHE Error" : ready ? "FHE Ready" : "FHE Init";
  return (
    <span className={`ml-3 inline-flex items-center gap-2 text-xs px-2 py-1 rounded-full border border-white/10`}> 
      <span className={`h-2 w-2 rounded-full ${color}`} />
      {text}
    </span>
  );
}



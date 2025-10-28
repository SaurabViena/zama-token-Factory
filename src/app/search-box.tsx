"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBox() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const address = query.trim();
    if (!address) return;
    
    // Validate Ethereum address format
    if (address.startsWith("0x") && address.length === 42) {
      router.push(`/token/${address}`);
      setQuery("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative max-w-md w-full">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by contract address (0x...)"
          className="w-full h-9 pl-9 pr-4 rounded-full bg-foreground/[0.05] border border-white/10 text-sm placeholder:text-foreground/50 outline-none focus:border-sky-400 focus:bg-foreground/[0.08] transition-all"
        />
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50"
        >
          <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
          <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
    </form>
  );
}

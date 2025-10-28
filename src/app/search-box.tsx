"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useReadContract, useReadContracts } from "wagmi";
import { TokenFactoryABI } from "@/config/abi";
import Image from "next/image";

const FACTORY_ADDRESS = process.env.NEXT_PUBLIC_FACTORY_ADDRESS as `0x${string}` | undefined;

type TokenInfo = {
  token: string;
  name: string;
  symbol: string;
  iconCid: string;
};

export default function SearchBox() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [filteredTokens, setFilteredTokens] = useState<TokenInfo[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  const countRes = useReadContract({
    abi: TokenFactoryABI as unknown as import("viem").Abi,
    address: FACTORY_ADDRESS,
    functionName: "getTokensCount",
    query: { enabled: Boolean(FACTORY_ADDRESS) },
  });

  const count = Number(countRes.data || 0);
  const allIndices = Array.from({ length: count }, (_, i) => i);

  const tokensRes = useReadContracts({
    contracts: allIndices.map((i) => ({
      abi: TokenFactoryABI as unknown as import("viem").Abi,
      address: FACTORY_ADDRESS!,
      functionName: "getTokenInfo",
      args: [BigInt(i)],
    })),
    query: { enabled: Boolean(FACTORY_ADDRESS) && count > 0 },
  });

  const allTokens = useMemo(() => {
    return (tokensRes.data || [])
      .map((result: { result?: unknown }) => {
        const data = result.result as {
          token: string;
          name: string;
          symbol: string;
          iconCid: string;
        } | undefined;
        if (!data) return null;
        return {
          token: data.token,
          name: data.name,
          symbol: data.symbol,
          iconCid: data.iconCid,
        };
      })
      .filter((token): token is TokenInfo => token !== null);
  }, [tokensRes.data]);

  useEffect(() => {
    if (!query.trim()) {
      setFilteredTokens([]);
      setIsOpen(false);
      return;
    }

    const filtered = allTokens.filter((token) => {
      const searchTerm = query.toLowerCase();
      return (
        token.name.toLowerCase().includes(searchTerm) ||
        token.symbol.toLowerCase().includes(searchTerm) ||
        token.token.toLowerCase().includes(searchTerm)
      );
    }).slice(0, 5);

    setFilteredTokens(filtered);
    setIsOpen(filtered.length > 0);
  }, [query, allTokens]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const address = query.trim();
    if (!address) return;
    
    // Validate Ethereum address format
    if (address.startsWith("0x") && address.length === 42) {
      router.push(`/token/${address}`);
      setQuery("");
      setIsOpen(false);
    }
  };

  const handleTokenSelect = (token: TokenInfo) => {
    router.push(`/token/${token.token}`);
    setQuery("");
    setIsOpen(false);
  };

  const gateway = process.env.NEXT_PUBLIC_PINATA_GATEWAY || "";

  return (
    <div ref={searchRef} className="relative max-w-md w-full">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tokens or paste address..."
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

      {isOpen && filteredTokens.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-white/10 rounded-lg shadow-lg z-50 overflow-hidden">
          {filteredTokens.map((token) => {
            const iconUrl = token.iconCid && gateway ? `https://${gateway}/ipfs/${token.iconCid}` : "";
            return (
              <button
                key={token.token}
                onClick={() => handleTokenSelect(token)}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-foreground/[0.05] transition-colors text-left"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden bg-foreground/10 flex-shrink-0">
                  {iconUrl ? (
                    <Image src={iconUrl} alt="icon" width={32} height={32} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center text-white font-semibold text-xs">
                      {token.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{token.name}</div>
                  <div className="text-xs text-foreground/60 truncate">{token.symbol}</div>
                </div>
                <div className="text-xs text-foreground/40 font-mono">
                  {token.token.slice(0, 6)}...{token.token.slice(-4)}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

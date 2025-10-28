"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAccount, useWriteContract } from "wagmi";
import { TokenFactoryABI } from "@/config/abi";

const FACTORY_ADDRESS = process.env.NEXT_PUBLIC_FACTORY_ADDRESS as `0x${string}` | undefined;

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block mb-3">
      <span className="block text-sm mb-1 text-foreground/80">
        {label}
        {required ? <span className="ml-1 text-red-500">*</span> : null}
      </span>
      {children}
    </label>
  );
}

export default function CreateTokenPage() {
  const router = useRouter();
  const { isConnected } = useAccount();
  const { writeContractAsync, isPending } = useWriteContract();

  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [description, setDescription] = useState("");
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [maxSupply, setMaxSupply] = useState("");
  const [creatorBps, setCreatorBps] = useState("");
  const [publicBps, setPublicBps] = useState("");
  const [perMint, setPerMint] = useState("");
  const [perWallet, setPerWallet] = useState("0");
  const [isPublicTotal, setIsPublicTotal] = useState(true);
  const [renounceOnCreation, setRenounceOnCreation] = useState(true);

  const [toast, setToast] = useState<string>("");

  // UI uses percentage (0-100), convert to basis points (*100) on submit
  const bpsOk = useMemo(() => {
    if (creatorBps === "" || publicBps === "") return true;
    return Number(creatorBps) + Number(publicBps) <= 100;
  }, [creatorBps, publicBps]);

  function showToast(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(""), 1500);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!FACTORY_ADDRESS) {
      showToast("Missing factory address, please configure NEXT_PUBLIC_FACTORY_ADDRESS");
      return;
    }
    if (!isConnected) {
      showToast("Please connect wallet first");
      return;
    }
    if (!bpsOk) {
      showToast("Sum of both percentages must be ≤100");
      return;
    }
    if (!name || !symbol || !maxSupply || !perMint || creatorBps === "" || publicBps === "") {
      showToast("Please fill in required fields");
      return;
    }
    const perWalletNum = perWallet === "" ? 0 : Number(perWallet);
    
    try {
      const cPct = Number(creatorBps);
      const pPct = Number(publicBps);
      if (
        Number.isNaN(cPct) ||
        Number.isNaN(pPct) ||
        cPct < 0 ||
        pPct < 0 ||
        cPct > 100 ||
        pPct > 100 ||
        cPct + pPct > 100
      ) {
        showToast("Percentages must be 0-100 and sum ≤100");
        return;
      }
      const creatorBpsValue = Math.round(cPct * 100);
      const publicBpsValue = Math.round(pPct * 100);

      let iconCid = "";
      if (iconFile) {
        setUploading(true);
        try {
          const fd = new FormData();
          fd.append("file", iconFile);
          const res = await fetch("/api/ipfs/pinata", { method: "POST", body: fd });
          const json = await res.json();
          if (!res.ok) throw new Error(json?.error || "Upload failed");
          iconCid = json.cid as string;
        } catch (err) {
          const msg = (err as Error)?.message || "Image upload failed";
          showToast(msg);
          return;
        } finally {
          setUploading(false);
        }
      }

      await writeContractAsync({
        abi: TokenFactoryABI as unknown as import("viem").Abi,
        address: FACTORY_ADDRESS,
        functionName: "createToken",
        args: [
          name,
          symbol,
          description,
          iconCid,
          BigInt(maxSupply),
          creatorBpsValue,
          publicBpsValue,
          BigInt(perMint),
          perWalletNum,
          Boolean(isPublicTotal),
          Boolean(renounceOnCreation),
        ],
      });
      showToast("Token created successfully!");
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (err) {
      const message = (err as Error)?.message || "Submission failed";
      showToast(message);
    }
  }

  return (
    <div className="w-full p-6 md:p-8">
      {toast ? (
        <div className="toast-portal">
          <div className="rounded-md bg-foreground text-background px-3 py-2 text-sm shadow">
            {toast}
          </div>
        </div>
      ) : null}

      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground mb-4 transition-colors">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Home
        </Link>

        <div className="mb-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 text-sm space-y-1">
          <p className="font-medium text-blue-600 dark:text-blue-400">Privacy Notice</p>
          <p className="text-foreground/70">• Form parameters (name, symbol, supply, etc.) will be publicly recorded on-chain</p>
          <p className="text-foreground/70">• Token balances and transfer amounts are confidential data (FHE encrypted)</p>
          <p className="text-foreground/70">• &quot;Total Visible&quot; option controls whether total minted is publicly visible</p>
        </div>

        <h2 className="text-xl font-semibold mb-4 tracking-tight">Create Token</h2>
        
        {/* Icon upload: follows title, circular preview (click circle to select file) */}
        <div className="mb-4">
          <input
            id="icon-upload"
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploading || isPending}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              if (file.size > 2 * 1024 * 1024) {
                showToast("Image size cannot exceed 2MB");
                return;
              }
              setIconFile(file);
              setIconPreview(URL.createObjectURL(file));
            }}
          />
          <label htmlFor="icon-upload" className="inline-block cursor-pointer">
            <div
              className={`w-20 h-20 rounded-full overflow-hidden ring-1 ring-foreground/15 bg-foreground/10 flex items-center justify-center transition-opacity ${
                uploading ? "opacity-60" : "opacity-100"
              }`}
            >
              {iconPreview ? (
                <Image src={iconPreview} alt="preview" width={80} height={80} className="w-full h-full object-cover" />
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-foreground/60">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              )}
            </div>
          </label>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Name" required>
              <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-foreground/[0.05] outline-none" placeholder="My Token" />
            </Field>
            <Field label="Symbol" required>
              <input value={symbol} onChange={(e) => setSymbol(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-foreground/[0.05] outline-none" placeholder="MTK" />
            </Field>
          </div>

          <Field label="Description">
            <input value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-foreground/[0.05] outline-none" placeholder="Optional" />
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Max Supply" required>
              <input 
                type="number" 
                min="1" 
                step="1" 
                inputMode="numeric" 
                value={maxSupply} 
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "" || /^\d+$/.test(val)) setMaxSupply(val);
                }} 
                className="w-full px-3 py-2 rounded-lg bg-foreground/[0.05] outline-none" 
                placeholder="1000000" 
              />
            </Field>
            <Field label="Amount per Mint" required>
              <input 
                type="number" 
                min="1" 
                step="1" 
                inputMode="numeric" 
                value={perMint} 
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "" || /^\d+$/.test(val)) setPerMint(val);
                }} 
                className="w-full px-3 py-2 rounded-lg bg-foreground/[0.05] outline-none" 
                placeholder="100" 
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Creator Reserve" required>
              <div className="relative">
                <input 
                  type="number" 
                  min="0" 
                  max="100" 
                  step="0.01" 
                  inputMode="decimal" 
                  value={creatorBps} 
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "" || /^\d*\.?\d{0,2}$/.test(val)) {
                      const num = parseFloat(val);
                      if (val === "" || (!isNaN(num) && num >= 0 && num <= 100) || val.endsWith(".")) {
                        setCreatorBps(val);
                      }
                    }
                  }} 
                  className="w-full px-3 py-2 pr-8 rounded-lg bg-foreground/[0.05] outline-none" 
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 pointer-events-none">%</span>
              </div>
            </Field>
            <Field label="Public Mint" required>
              <div className="relative">
                <input 
                  type="number" 
                  min="0" 
                  max="100" 
                  step="0.01" 
                  inputMode="decimal" 
                  value={publicBps} 
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "" || /^\d*\.?\d{0,2}$/.test(val)) {
                      const num = parseFloat(val);
                      if (val === "" || (!isNaN(num) && num >= 0 && num <= 100) || val.endsWith(".")) {
                        setPublicBps(val);
                      }
                    }
                  }} 
                  className="w-full px-3 py-2 pr-8 rounded-lg bg-foreground/[0.05] outline-none" 
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 pointer-events-none">%</span>
              </div>
            </Field>
            <Field label="Per Wallet Limit (0=Unlimited)">
              <input 
                type="number" 
                min="0" 
                step="1" 
                inputMode="numeric" 
                value={perWallet} 
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "" || /^\d+$/.test(val)) setPerWallet(val);
                }} 
                className="w-full px-3 py-2 rounded-lg bg-foreground/[0.05] outline-none" 
              />
            </Field>
          </div>
          {!bpsOk ? <p className="text-sm text-red-400">Sum of both percentages must be ≤100</p> : null}

          <div className="flex items-center gap-6">
            <label className="inline-flex items-center gap-2 text-sm" title="If checked, total supply is publicly visible on-chain; otherwise it remains confidential">
              <input type="checkbox" checked={isPublicTotal} onChange={(e) => setIsPublicTotal(e.target.checked)} />
              Total Visible
            </label>
            <label className="inline-flex items-center gap-2 text-sm" title="If checked, governance will be automatically renounced upon token creation (irreversible)">
              <input type="checkbox" checked={renounceOnCreation} onChange={(e) => setRenounceOnCreation(e.target.checked)} />
              Renounce on Creation
            </label>
          </div>

          <div className="pt-2">
            <button disabled={!isConnected || isPending || uploading} className="h-11 px-6 rounded-full bg-[#FFDD00] text-black text-sm font-medium hover:bg-[#FFE44D] transition-colors disabled:opacity-60 disabled:hover:bg-[#FFDD00]">
              {uploading ? "Uploading..." : isPending ? "Submitting..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}



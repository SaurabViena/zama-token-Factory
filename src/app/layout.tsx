import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Link from "next/link";
import Script from "next/script";
import WalletButton from "./wallet-button";
import ZamaReadyBadge from "./zama-ready";
import SearchBox from "./search-box";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Confidential Token Factory - Create Confidential Tokens",
  description: "Create Zama confidential tokens effortlessly. Private transactions, secure and reliable.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Only keep ESM approach to avoid cross-origin embedded resource issues from UMD */}
        <Script id="zama-esm-bridge" type="module" strategy="afterInteractive">
          {`
            (async () => {
              try {
                // Preserve existing UMD global if already present
                if (!window.ZamaRelayerSDK) {
                  const mod = await import('https://cdn.zama.ai/relayer-sdk-js/0.2.0/relayer-sdk-js.js');
                  const { initSDK, createInstance, SepoliaConfig } = mod;
                  window.ZamaRelayerSDK = { initSDK, createInstance, SepoliaConfig };
                }
              } catch (e) {
                // Only output in development mode to avoid polluting production logs
                if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV !== 'production') {
                  console.error('Zama ESM bridge failed:', e);
                }
              }
            })();
          `}
        </Script>
        <Providers>
          <div className="min-h-dvh flex flex-col">
            <header className="w-full px-6 py-3">
              <div className="grid grid-cols-3 items-center">
                <div className="flex justify-start">
                  <Link href="/" className="flex items-center gap-2 text-base font-medium tracking-tight hover:opacity-80 transition-opacity">
                    <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g transform="translate(8, 8)">
                        <rect x="7" y="0" width="2" height="2.5" fill="#FFDD00"/>
                        <rect x="12.5" y="1.5" width="2.5" height="2" transform="rotate(45 13.75 2.5)" fill="#FFDD00"/>
                        <rect x="14.5" y="7" width="2.5" height="2" fill="#FFDD00"/>
                        <rect x="12.5" y="12.5" width="2.5" height="2" transform="rotate(-45 13.75 13.5)" fill="#FFDD00"/>
                        <rect x="7" y="14.5" width="2" height="2.5" fill="#FFDD00"/>
                        <rect x="1" y="12.5" width="2.5" height="2" transform="rotate(45 2.25 13.5)" fill="#FFDD00"/>
                        <rect x="-1" y="7" width="2.5" height="2" fill="#FFDD00"/>
                        <rect x="1" y="1.5" width="2.5" height="2" transform="rotate(-45 2.25 2.5)" fill="#FFDD00"/>
                        <circle cx="8" cy="8" r="5.5" fill="#FFDD00"/>
                        <circle cx="8" cy="8" r="3" fill="#0A0A0A"/>
                        <circle cx="8" cy="8" r="1.5" fill="#FFDD00" opacity="0.6"/>
                      </g>
                      <g transform="translate(18, 18)">
                        <rect x="4.5" y="0" width="1.5" height="1.5" fill="#22C55E"/>
                        <rect x="8.5" y="2" width="1.5" height="1.5" transform="rotate(60 9.25 2.75)" fill="#22C55E"/>
                        <rect x="8.5" y="6.5" width="1.5" height="1.5" transform="rotate(-60 9.25 7.25)" fill="#22C55E"/>
                        <rect x="4.5" y="9" width="1.5" height="1.5" fill="#22C55E"/>
                        <rect x="0.5" y="6.5" width="1.5" height="1.5" transform="rotate(60 1.25 7.25)" fill="#22C55E"/>
                        <rect x="0.5" y="2" width="1.5" height="1.5" transform="rotate(-60 1.25 2.75)" fill="#22C55E"/>
                        <circle cx="5.5" cy="5.5" r="3.5" fill="#22C55E"/>
                        <circle cx="5.5" cy="5.5" r="2" fill="#0A0A0A"/>
                        <circle cx="5.5" cy="5.5" r="1" fill="#22C55E" opacity="0.6"/>
                      </g>
                    </svg>
                    <span>Confidential Token Factory</span>
                  </Link>
                </div>
                <div className="flex justify-center">
                  <SearchBox />
                </div>
                <div className="flex justify-end items-center">
                  <ZamaReadyBadge />
                  <WalletButton />
                </div>
              </div>
            </header>
            <main className="flex-1">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}

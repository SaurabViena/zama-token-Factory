import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    minimumCacheTTL: 31536000,
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.mypinata.cloud",
      },
      {
        protocol: "https",
        hostname: "gateway.pinata.cloud",
      },
    ],
  },
  headers: async () => {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Embedder-Policy", value: "credentialless" },
        ],
      },
    ];
  },
};

export default nextConfig;

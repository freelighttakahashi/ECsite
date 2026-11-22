import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "img02.shop-pro.jp" },
      { protocol: "https", hostname: "pub-d9884eea68a34f3f9f9abde1fc7667a2.r2.dev" },
    ],
  },
};

export default nextConfig;
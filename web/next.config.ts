import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "img02.shop-pro.jp" },
    ],
  },
};

export default nextConfig;
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.crackd.ai",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;

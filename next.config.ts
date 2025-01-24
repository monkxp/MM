import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "udvylitxgdvekcsfbnlz.supabase.co",
      },
    ],
  },
  reactStrictMode: true,
  experimental: {
    clientRouterFilter: true,
  },

  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "vvhikruvqzanzbbazdit.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/islands/**",
      },
    ],
  },
  // Add webpack configuration for handling audio files
  webpack: (config) => {
    // Configure how audio files are handled
    config.module.rules.push({
      test: /\.(mp3|wav|ogg)$/i,
      type: "asset/resource",
      generator: {
        filename: "static/media/[name].[hash][ext]",
      },
    });

    return config;
  },
};

export default nextConfig;

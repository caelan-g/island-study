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
};

export default nextConfig;

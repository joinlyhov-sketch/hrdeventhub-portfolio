import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: "standalone",
  productionBrowserSourceMaps: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.hrdevent.app",
      },
      {
        protocol: "http",
        hostname: "**.hrdevent.app",
      },
      {
        protocol: "https",
        hostname: "**.4kwallpapers.com",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "9090",
        pathname: "/api/v5/files/**",
      },
      {
        protocol: "https",
        hostname: "api.dicebear.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.dev.hrdevent.app",
        pathname: "/api/v5/files/**",
      },
      {
        protocol: "https",
        hostname: "cdn.jsdelivr.net",
      },
      {
        protocol: "https",
        hostname: "**.twimg.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb",
    },
    staleTimes: {
      dynamic: 60,
      static: 300,
    },
  },
  async rewrites() {
    return [
      {
        source: "/api/v5/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.hrdevent.app/api/v5"}/:path*`,
      },
    ];
  },
};

export default nextConfig;

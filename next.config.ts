import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: "standalone",
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
        pathname: "/api/v4/files/**",
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb",
    },
  },
  async rewrites() {
    return [
      {
        source: "/api/v4/:path*",
        destination: "https://api.dev.hrdevent.app/api/v4/:path*",
      },
    ];
  },
};

export default nextConfig;

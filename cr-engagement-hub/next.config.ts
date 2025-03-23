import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // Enable modern features
    serverActions: {
      bodySizeLimit: '2mb'
    },
    serverComponentsExternalPackages: [],
  },
  // Ensure correct asset handling
  images: {
    domains: [],
  },
  // Add headers for security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

export default nextConfig;

// next.config.js
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,  
  images: {
    dangerouslyAllowSVG: true,
    domains: ["media.licdn.com", "avatars.githubusercontent.com","lh3.googleusercontent.com"], // Pastikan GitHub Avatars disertakan
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com", 
      },
      {
        protocol: "https",
        hostname: "media.licdn.com",
        pathname: "/dms/image/**",
      },
    ],
  },
  experimental: {
    ppr: "incremental",
    after:true
  },
  devIndicators: {
    appIsrStatus: true,
    buildActivity: true,
    buildActivityPosition: "bottom-right",
  },
};

export default nextConfig;

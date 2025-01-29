import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'products-categories-images.s3.ap-south-1.amazonaws.com',
        port: '',
        pathname: '/categories-images/**',
      }
    ]
  }
  
};

export default nextConfig;

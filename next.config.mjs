// import type { NextConfig } from "next";

const nextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      // Remove the localtunnel entry
      // {
      //   protocol: 'https', 
      //   hostname: 'five-turkeys-switch.loca.lt',
      // },
      {
        protocol: 'https',
        hostname: 'ethereum-magicians-test.vercel.app', // Correct Vercel hostname format
      },
      // Add localhost for local development
      {
        protocol: 'http', // Usually http for localhost
        hostname: 'localhost',
        port: '3000', // Default Next.js dev port
      },
      // Add other trusted domains if needed, e.g., your production domain
    ],
  },
};

export default nextConfig;

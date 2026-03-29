import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Allow cross-origin requests from preview panel
  allowedDevOrigins: [
    "preview-chat-6ecc2d6c-2ff4-4bb1-9056-222d302afe51.space.z.ai",
    ".space.z.ai",
    "localhost",
  ],
};

export default nextConfig;

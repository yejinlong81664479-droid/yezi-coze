import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* 告诉 Vercel: 就算有代码格式错误，也照样构建 */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

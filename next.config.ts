import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import type { Configuration } from "webpack";

// ✅ โหลด .env สำหรับ Jenkins หรือ local dev
import dotenv from "dotenv";
dotenv.config();

const withAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
  analyzerMode: "static",
  openAnalyzer: false,
});

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },

  // ✅ Inject ENV variables ไปยังฝั่ง client
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_CONTEXT_PATH: process.env.NEXT_PUBLIC_CONTEXT_PATH,
    JWT_SECRET: process.env.JWT_SECRET, // ใช้ได้เฉพาะฝั่ง server
  },

  webpack: (config: Configuration, { isServer }: { isServer: boolean }) => {
    if (process.env.ANALYZE === "true") {
      config.plugins = config.plugins || [];
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: "static",
          reportFilename: isServer
            ? "analyze/server.html"
            : "analyze/client.html",
        })
      );
    }
    return config;
  },
};

export default withAnalyzer(nextConfig);
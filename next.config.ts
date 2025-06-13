import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import type { Configuration } from "webpack";

const withAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
  analyzerMode: "static",
  openAnalyzer: false,
});

const nextConfig: NextConfig = {
  output: "export", // ✅ สำคัญ! เพิ่มบรรทัดนี้
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true, // ✅ ถ้าใช้ <Image /> ต้องมีบรรทัดนี้ด้วย
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

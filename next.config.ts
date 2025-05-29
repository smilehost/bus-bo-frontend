// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
//   eslint: {ignoreDuringBuilds: true}, // Ignore ESLint errors during build
// };

// export default nextConfig;

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
  eslint: {
    ignoreDuringBuilds: true,
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






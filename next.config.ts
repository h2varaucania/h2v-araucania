import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ["sharp", "graphql"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default withPayload(nextConfig);

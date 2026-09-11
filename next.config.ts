import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-contained server bundle for Docker (.next/standalone).
  output: "standalone",
  // Include the built registry JSON in the serverless bundle so the
  // /r/[name] route handler can read it at runtime.
  outputFileTracingIncludes: {
    "/r/[name]": ["./.registry/**/*"],
    // Base-color palettes served unauthenticated for offline installs; the
    // shadcn CLI fetches these from ${REGISTRY_URL}/colors/<base>.json.
    "/r/colors/[name]": ["./registry-colors/**/*"],
  },
};

export default nextConfig;

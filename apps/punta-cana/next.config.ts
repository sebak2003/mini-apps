import type { NextConfig } from "next";
import { config } from "dotenv";
import { resolve } from "path";

// Load root-level .env.local for shared secrets in local dev.
// In production (Vercel), shared env vars come from team-level settings.
config({ path: resolve(import.meta.dirname, "../../.env.local") });

const nextConfig: NextConfig = {
  transpilePackages: ["@repo/env", "@repo/db"],
};

export default nextConfig;

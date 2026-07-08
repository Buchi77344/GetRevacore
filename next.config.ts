import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @hello-pangea/dnd ships prebuilt CJS that the bundler needs to
  // transpile from source to resolve correctly.
  transpilePackages: ["@hello-pangea/dnd"],
  /* config options here */
};

export default nextConfig;

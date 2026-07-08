import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Transpile dependencies from source so Turbopack doesn't deadlock on
  // their prebuilt CJS during the SPA bundle compilation.
  transpilePackages: [
    "@hello-pangea/dnd",
    "react-router-dom",
    "react-hot-toast",
    "lucide-react",
    "@supabase/supabase-js",
  ],
  /* config options here */
};

export default nextConfig;

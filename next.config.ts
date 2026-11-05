import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { formats: ["image/avif", "image/webp"] },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  // Links from the previous version of the site keep working.
  async redirects() {
    return [
      { source: "/work/:slug", destination: "/#project-:slug", permanent: false },
      { source: "/resume", destination: "/#resume", permanent: false },
      { source: "/contact", destination: "/#contacts", permanent: false },
    ];
  },
};

export default nextConfig;

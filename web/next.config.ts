import type { NextConfig } from "next";

const isGithubPages = process.env.EXPORT_STATIC === "true";
const repo = "Interior-Mood-Translator";

const nextConfig: NextConfig = {
  output: isGithubPages ? "export" : undefined,
  images: {
    unoptimized: true,
  },
  basePath: isGithubPages ? `/${repo}` : "",
  assetPrefix: isGithubPages ? `/${repo}/` : "",
};

export default nextConfig;

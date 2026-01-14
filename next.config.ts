import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    DIRECT_URL: process.env.DIRECT_URL,
    DEEPGRAM_API_KEY: process.env.DEEPGRAM_API_KEY,
    VOXIMPLANT_ACCOUNT_ID: process.env.VOXIMPLANT_ACCOUNT_ID,
    VOXIMPLANT_API_KEY: process.env.VOXIMPLANT_API_KEY,
    JWT_SECRET: process.env.JWT_SECRET,
  },
};

export default nextConfig;

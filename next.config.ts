import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "sea1.ingest.uploadthing.com",
        port: "",
        search: "",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
        port: "",
        search: "",
      },
      {
        protocol: "https",
        hostname: "6drj293hgw.ufs.sh",
        port: "",
        search: "",
      },
    ],
    // domains: ["sea1.ingest.uploadthing.com", "utfs.io"],
  },
};

// export default nextConfig;
module.exports = nextConfig;

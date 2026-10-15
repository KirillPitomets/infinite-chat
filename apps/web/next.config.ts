import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/chgwa8qh/**"
      },
      {
        protocol: "https",
        hostname: "img.clerk.com"
      }
    ]
  }
}

export default nextConfig

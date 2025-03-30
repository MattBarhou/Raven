/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["raven-ibr7.onrender.com"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "cdn.discordapp.com",
      },

      {
        protocol: "https",
        hostname: "raven-bucket-barhou.s3.us-east-1.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;

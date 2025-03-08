/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },

      {
        protocol: "https",
        hostname: "raven-bucket-barhou.s3.us-east-1.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;

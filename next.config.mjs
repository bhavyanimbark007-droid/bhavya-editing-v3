/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "videos.pexels.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "media.giphy.com" },
    ],
  },
};

export default nextConfig;

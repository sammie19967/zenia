/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["lh3.googleusercontent.com", "res.cloudinary.com"], // Add domains for external images
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
       
      },
    ],
  },
};

export default nextConfig;

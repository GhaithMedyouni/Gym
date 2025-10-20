/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', // ✅ pour hébergement Vercel / Render
  images: {
    unoptimized: true, // ✅ évite erreur compression
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['*'], // évite TLS 500 edge sur certaines pages
    },
  },
};

export default nextConfig;

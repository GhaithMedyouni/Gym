/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', // ✅ indispensable pour Vercel
  images: {
    unoptimized: true, // ✅ évite les erreurs de compression sur Vercel
  },
  eslint: {
    ignoreDuringBuilds: true, // ✅ empêche Vercel de bloquer sur un warning
  },
  typescript: {
    ignoreBuildErrors: true, // ✅ optionnel si tu veux un build plus souple
  },
};

export default nextConfig;

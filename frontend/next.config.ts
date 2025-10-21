/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // ✅ génère /out automatiquement
  images: { unoptimized: true },
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;

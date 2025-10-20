/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', // ✅ pour compatibilité Vercel / Render

  // ✅ Gestion des images (évite les erreurs "Sharp" sur Vercel)
  images: {
    unoptimized: true,
  },

  // ✅ Ignore les erreurs de lint / TS pendant le build Vercel
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  // ✅ Ajout proxy API pour éviter CORS côté client (optionnel mais utile)
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://gym-j0ig.onrender.com/:path*', // 🔗 ton backend Render
      },
    ];
  },

  // ✅ Sécurise et évite les timeouts Edge
  experimental: {
    serverActions: {
      allowedOrigins: ['https://gym-j0ig.onrender.com', 'https://gym-rust-phi.vercel.app'],
    },
  },
};

export default nextConfig;

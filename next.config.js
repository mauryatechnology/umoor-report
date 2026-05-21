/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.unsplash.com' },
      { protocol: 'https', hostname: '**.blrjmt.com' },
      { protocol: 'https', hostname: '**.vercel-storage.com' },
      { protocol: 'https', hostname: '**.public.blob.vercel-storage.com' },
    ],
  },
  async rewrites() {
    return [
      // Path-based fallbacks for local development & free-tier Vercel
      { source: '/r/:location', destination: '/report/:location' },
      { source: '/r/:location/:path*', destination: '/report/:location/:path*' },
      { source: '/d/:location', destination: '/dashboard/:location' },
      { source: '/d/:location/:path*', destination: '/dashboard/:location/:path*' },
    ];
  },
};

export default nextConfig;

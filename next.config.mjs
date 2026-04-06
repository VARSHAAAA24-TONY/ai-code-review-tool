/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  typescript: {
    // ⚠️ Allow production builds even with type errors during migration
    ignoreBuildErrors: true,
  },
  eslint: {
    // ⚠️ Allow production builds even with lint errors during migration
    ignoreDuringBuilds: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.googleusercontent.com',
      },
    ],
  },
  // Removed experimental optimizePackageImports to ensure maximum build stability
};

export default nextConfig;



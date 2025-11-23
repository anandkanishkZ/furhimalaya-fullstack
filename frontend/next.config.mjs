/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Conditionally enable static export only for production builds
  ...(process.env.NODE_ENV === 'production' && process.env.STATIC_EXPORT === 'true' ? { 
    output: 'export',
    distDir: 'out',
    trailingSlash: true,
    images: { unoptimized: true }
  } : {}),
  trailingSlash: true,
  images: {
    unoptimized: process.env.STATIC_EXPORT === 'true' ? true : false, // Disable optimization for static export
    formats: ['image/webp', 'image/avif'], // Use modern formats
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 2592000, // 30 days cache
    domains: ['images.unsplash.com', 'localhost', 'forevershine.com.np', 'www.forevershine.com.np', 'api.forevershine.com.np'],
    remotePatterns: [
      // Development - localhost
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/api/media/serve/**',
      },
      // Production - API domain (backend uploads)
      {
        protocol: 'https',
        hostname: 'api.forevershine.com.np',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'api.forevershine.com.np',
        pathname: '/api/**',
      },
      // Production - Main domain
      {
        protocol: 'https',
        hostname: 'forevershine.com.np',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'forevershine.com.np',
        pathname: '/api/media/serve/**',
      },
      {
        protocol: 'https',
        hostname: 'www.forevershine.com.np',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'www.forevershine.com.np',
        pathname: '/api/media/serve/**',
      },
    ],
  },
  // Add custom headers for better caching
  async headers() {
    return [
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*.png',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*.jpg',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*.svg',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
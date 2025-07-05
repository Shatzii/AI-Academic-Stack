/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost', 'railway.app', 'vercel.app', 'shatzii.com'],
    unoptimized: true,
  },
  env: {
    USE_SELF_HOSTED_AI: process.env.USE_SELF_HOSTED_AI || 'true',
    AI_FALLBACK_TO_CLOUD: process.env.AI_FALLBACK_TO_CLOUD || 'false',
    PLATFORM_NAME: process.env.PLATFORM_NAME || 'Universal One School',
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
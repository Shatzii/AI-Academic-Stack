/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  env: {
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    PERPLEXITY_API_KEY: process.env.PERPLEXITY_API_KEY,
    DATABASE_URL: process.env.DATABASE_URL,
  },
  async redirects() {
    return [
      {
        source: '/index.html',
        destination: '/',
        permanent: true,
      },
      {
        source: '/schools-landing-page.html',
        destination: '/schools',
        permanent: true,
      },
      {
        source: '/admin.html',
        destination: '/admin/dashboard',
        permanent: true,
      },
      {
        source: '/dashboard.html',
        destination: '/dashboard',
        permanent: true,
      }
    ]
  },
  async headers() {
    return [
      {
        source: '/_next/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
    ]
  },
  transpilePackages: ['@tanstack/react-query'],
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
}

export default nextConfig
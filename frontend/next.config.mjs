/** @type {import('next').NextConfig} */

const nextConfig = {
  async redirects() {
    return [
      {
        source: '/index',
        destination: '/',
        permanent: true,
      },
      // Legacy product category query param routing → Dedicated category route
      // Locale-prefixed variants
      {
        source: '/:lang/products',
        has: [
          { type: 'query', key: 'category', value: '(?<category>[^&]+)' },
          { type: 'query', key: 'page', value: '(?<page>[^&]+)' },
          { type: 'query', key: 'sort', value: '(?<sort>[^&]+)' },
        ],
        destination: '/:lang/products/category/:category?page=:page&sort=:sort',
        permanent: true,
      },
      {
        source: '/:lang/products',
        has: [
          { type: 'query', key: 'category', value: '(?<category>[^&]+)' },
          { type: 'query', key: 'page', value: '(?<page>[^&]+)' },
        ],
        destination: '/:lang/products/category/:category?page=:page',
        permanent: true,
      },
      {
        source: '/:lang/products',
        has: [
          { type: 'query', key: 'category', value: '(?<category>[^&]+)' },
          { type: 'query', key: 'sort', value: '(?<sort>[^&]+)' },
        ],
        destination: '/:lang/products/category/:category?sort=:sort',
        permanent: true,
      },
      {
        source: '/:lang/products',
        has: [
          { type: 'query', key: 'category', value: '(?<category>[^&]+)' },
        ],
        destination: '/:lang/products/category/:category',
        permanent: true,
      },
      // Unprefixed fallback → default locale (en)
      {
        source: '/products',
        has: [
          { type: 'query', key: 'category', value: '(?<category>[^&]+)' },
          { type: 'query', key: 'page', value: '(?<page>[^&]+)' },
          { type: 'query', key: 'sort', value: '(?<sort>[^&]+)' },
        ],
        destination: '/en/products/category/:category?page=:page&sort=:sort',
        permanent: true,
      },
      {
        source: '/products',
        has: [
          { type: 'query', key: 'category', value: '(?<category>[^&]+)' },
          { type: 'query', key: 'page', value: '(?<page>[^&]+)' },
        ],
        destination: '/en/products/category/:category?page=:page',
        permanent: true,
      },
      {
        source: '/products',
        has: [
          { type: 'query', key: 'category', value: '(?<category>[^&]+)' },
          { type: 'query', key: 'sort', value: '(?<sort>[^&]+)' },
        ],
        destination: '/en/products/category/:category?sort=:sort',
        permanent: true,
      },
      {
        source: '/products',
        has: [
          { type: 'query', key: 'category', value: '(?<category>[^&]+)' },
        ],
        destination: '/en/products/category/:category',
        permanent: true,
      },
    ]
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

export default nextConfig;
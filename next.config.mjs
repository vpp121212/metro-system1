/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: {
    typedRoutes: false,
  },
  images: {
    domains: [],
  },
}

export default nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['chit-chat-render.onrender.com']
  },
  // Enable if you need to support older browsers
  // transpilePackages: ['lucide-react']
}

module.exports = nextConfig
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverRuntimeConfig: {
    middleware: (req, res) => middleware.default(req, res),
  },
};

module.exports = nextConfig;

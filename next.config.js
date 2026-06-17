/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Emit a self-contained server bundle (.next/standalone + server.js) so the
  // multi-stage Dockerfile / AWS image stays small and runs `node server.js`.
  output: 'standalone',
};

module.exports = nextConfig;

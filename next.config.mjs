/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
    ],
  },
  webpack(config, { isServer }) {
    // Enable WebAssembly
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true, // Recommended for Webpack 5
    };

    // Add WebAssembly rule for .wasm files
    config.module.rules.push({
      test: /\.wasm$/,
      type: "webassembly/async", // Specify WebAssembly type for .wasm files
    });

    return config;
  },
};

export default nextConfig;

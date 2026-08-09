/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['maplibre-gl'],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'maplibre-gl$': 'maplibre-gl/dist/maplibre-gl.js',
    };
    return config;
  },
  turbopack: {
    resolveAlias: {
      'maplibre-gl$': 'maplibre-gl/dist/maplibre-gl.js',
    },
  },
};

export default nextConfig;

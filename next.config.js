/** @type {import('next').NextConfig} */

module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config, options) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    config.module.rules.push({
      test: /\.csv$/,
      loader: "csv-loader",
      options: {
        dynamicTyping: true,
        header: true,
        skipEmptyLines: true,
      },
    });
    return config;
  },
};

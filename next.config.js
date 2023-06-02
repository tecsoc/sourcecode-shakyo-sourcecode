/** @type {import('next').NextConfig} */
const isProduction = process.env.NODE_ENV === 'production';
const nextConfig = {
  assetPrefix: isProduction ? 'syakyo-typing' : '',
  output: 'export'
};

module.exports = nextConfig;

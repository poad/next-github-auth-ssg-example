/** @type {import('next').NextConfig} */
const config =  {
  reactStrictMode: true,
  swcMinify: true,
  trailingSlash: true,
  cleanDistDir: true,
  images: {
    unoptimized: true,
  },
};

module.exports = config;

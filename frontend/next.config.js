/** @type {import('next').NextConfig} */
const config =  {
  output: 'export',
  reactStrictMode: true,
  trailingSlash: true,
  cleanDistDir: true,
  images: {
    unoptimized: true,
  },
};

export default config;

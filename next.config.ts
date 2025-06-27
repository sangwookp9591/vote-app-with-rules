import type { NextConfig } from 'next';

const {
  createVanillaExtractPlugin,
  // eslint-disable-next-line @typescript-eslint/no-require-imports
} = require('@vanilla-extract/next-plugin');
const withVanillaExtract = createVanillaExtractPlugin();

const nextConfig: NextConfig = {
  /* config options here */
  // experimental: {
  //     serverActions: {
  //         bodySizeLimit: '10mb', // Set the body size limit for server actions
  //     },
  // },
  // async rewrites() {
  //     return [
  //         {
  //             source: '/upload/:slug',
  //             destination: `${process.env.NEXT_PUBLIC_BASE_URL}/upload/:slug`, // Matched parameters can be used in the destination
  //         },
  //     ];
  // },
};

module.exports = withVanillaExtract(nextConfig);

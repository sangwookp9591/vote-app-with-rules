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
  // Next.js 15에서 app 디렉토리 기반 라우팅이 public 폴더 정적 서빙을 가로채지 않도록 설정
  async rewrites() {
    return [
      {
        // /uploads/... 경로를 public/uploads/...로 정적 파일 서빙하도록 설정
        source: '/uploads/:path*',
        destination: '/public/uploads/:path*',
      },
    ];
  },
};

module.exports = withVanillaExtract(nextConfig);

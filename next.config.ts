import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/demos/med-spa-501',
        destination: 'https://med-spa-501.cellura.ai',
        permanent: false,
      },
      {
        source: '/demos/med-spa-501/:path*',
        destination: 'https://med-spa-501.cellura.ai/:path*',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;

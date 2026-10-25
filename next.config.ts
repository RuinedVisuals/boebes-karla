import type { NextConfig } from 'next';
import path from 'node:path';

const nextConfig: NextConfig = {
  sassOptions: {
    includePaths: [path.join(process.cwd(), 'src/styles')],
    loadPaths: [path.join(process.cwd(), 'src/styles')],
  },
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'cdn.sanity.io' }],
  },
};

export default nextConfig;

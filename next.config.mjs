const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['firebase-admin', 'sharp'],
  },
  // Include the ffmpeg binary in every serverless function bundle.
  // We reference it by path at runtime (see lib/video.ts) — no import needed.
  outputFileTracingIncludes: {
    '/**': ['./node_modules/ffmpeg-static/**/*'],
  },
}

export default nextConfig

const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['firebase-admin', 'sharp', 'ffmpeg-static'],
  },
  outputFileTracingIncludes: {
    '/api/cron/daily-video': ['./node_modules/ffmpeg-static/**/*'],
    '/api/run-pipeline': ['./node_modules/ffmpeg-static/**/*'],
  },
}

export default nextConfig

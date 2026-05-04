const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['firebase-admin', 'sharp', 'ffmpeg-static'],
  },
  // Ensure the ffmpeg binary is included in every serverless function bundle
  outputFileTracingIncludes: {
    '/**': ['./node_modules/ffmpeg-static/**/*'],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // webpack must not bundle ffmpeg-static — its __dirname-based path
      // resolution breaks inside a chunk; it must be require()'d from node_modules
      config.externals.push('ffmpeg-static')
    }
    return config
  },
}

export default nextConfig

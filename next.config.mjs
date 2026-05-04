const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['firebase-admin', 'sharp'],
  },
  outputFileTracingIncludes: {
    '/**': ['./node_modules/@fontsource/inter/files/*.woff'],
  },
}

export default nextConfig

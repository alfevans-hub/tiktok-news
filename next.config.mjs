const nextConfig = {
  experimental: {
    // firebase-admin uses Node.js built-ins that Next.js needs to treat as external
    serverComponentsExternalPackages: ['firebase-admin'],
  },
}

export default nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configurações básicas para compatibilidade
  reactStrictMode: true,
  swcMinify: true,
  
  // Otimizações de build
  compress: true,
  
  // Configuração de imagens
  images: {
    formats: ['image/webp', 'image/avif'],
    unoptimized: false,
  },
  
  // Configuração experimental (mais estável)
  experimental: {
    optimizePackageImports: ['recharts'],
  },
  
  // Configuração de webpack simplificada
  webpack: (config, { dev, isServer }) => {
    // Otimizações apenas para produção
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
          },
        },
      };
    }
    
    return config;
  },
};

module.exports = nextConfig;

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { splitVendorChunkPlugin } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    splitVendorChunkPlugin()
  ],
  build: {
    // Enable source maps for production debugging (set to true for Netlify)
    sourcemap: process.env.NODE_ENV === 'production' ? false : true,
    // Optimize chunk size
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Separate vendor chunks for better caching
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor'
            }
            if (id.includes('react-router-dom')) {
              return 'router-vendor'
            }
            if (id.includes('bootstrap') || id.includes('react-bootstrap') || id.includes('react-icons')) {
              return 'ui-vendor'
            }
            if (id.includes('@reduxjs/toolkit') || id.includes('react-redux')) {
              return 'state-vendor'
            }
            if (id.includes('axios') || id.includes('socket.io-client') || id.includes('react-hot-toast')) {
              return 'utils-vendor'
            }
            if (id.includes('chart.js') || id.includes('react-chartjs-2')) {
              return 'charts-vendor'
            }
            return 'vendor'
          }
          // Separate large components into chunks
          if (id.includes('components/ai/')) {
            return 'ai-components'
          }
          if (id.includes('components/courses/')) {
            return 'course-components'
          }
        },
        // Optimize chunk file names for Netlify
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.')
          const extType = info[info.length - 1]
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name)) {
            return `assets/img/[name]-[hash].${extType}`
          }
          if (/\.(css)$/i.test(assetInfo.name)) {
            return `assets/css/[name]-[hash].${extType}`
          }
          return `assets/[name]-[hash].${extType}`
        }
      }
    },
    // Optimize build for Netlify
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: process.env.NODE_ENV === 'production',
        drop_debugger: process.env.NODE_ENV === 'production',
        pure_funcs: process.env.NODE_ENV === 'production' ? ['console.log', 'console.info', 'console.debug'] : []
      }
    },
    // Set chunk size warning limit
    chunkSizeWarningLimit: 1000,
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Optimize for Netlify's CDN
    target: 'esnext',
    // Generate .br files for better compression
    brotliSize: false
  },
  // Optimize dev server
  server: {
    port: 5173,
    host: true,
    open: true,
    // Security headers for dev server
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
    }
  },
  // Dependency pre-bundling
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@reduxjs/toolkit',
      'react-redux',
      'axios',
      'react-hot-toast'
    ]
  },
  // Enable gzip compression
  preview: {
    port: 4173,
    strictPort: true
  },
  // Netlify-specific configuration
  base: process.env.NODE_ENV === 'production' ? '/' : '/',
  // Environment variables for Netlify
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
  }
})

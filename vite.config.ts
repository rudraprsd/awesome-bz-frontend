import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'buffer/': 'buffer',
      'stream': 'stream-browserify',
      'assert': 'assert',
    },
  },
  define: {
    'global': 'window',
    'process.env': {},
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://awesome-bz.delightfulpebble-4e97604d.centralindia.azurecontainerapps.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  preview: {
    proxy: {
      '/api': {
        target: 'https://awesome-bz.delightfulpebble-4e97604d.centralindia.azurecontainerapps.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks: {
          plotly: ['plotly.js', 'react-plotly.js'],
        },
      },
    },
  },
})

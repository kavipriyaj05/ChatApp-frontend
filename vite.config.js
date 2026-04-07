import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Fix: sockjs-client uses Node.js 'global' variable which doesn't exist in browsers
  define: {
    global: 'globalThis',
  },
  server: {
    port: 5173,
    // Proxy API calls to Spring Boot backend to avoid CORS in dev
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/ws': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        ws: true,
      },
    },
  },
})

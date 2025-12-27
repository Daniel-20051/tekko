import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import tanstackVitePlugin from '@tanstack/router-plugin/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackVitePlugin(), // Must be before react()
    react(),
    tailwindcss()
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React core libraries
          'react-vendor': ['react', 'react-dom'],
          // TanStack libraries
          'tanstack-vendor': [
            '@tanstack/react-router',
            '@tanstack/react-query',
            '@tanstack/react-router-devtools',
            '@tanstack/react-query-devtools'
          ],
          // UI/Animation libraries
          'ui-vendor': ['framer-motion', 'lucide-react'],
          // State management
          'state-vendor': ['zustand'],
          // HTTP client
          'http-vendor': ['axios'],
          // Utility libraries
          'utils-vendor': ['clsx']
        }
      }
    },
    chunkSizeWarningLimit: 1000 // Increase limit to 1MB for better visibility
  }
})

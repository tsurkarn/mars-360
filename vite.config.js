import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true
  },
  build: {
    target: 'esnext',
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks: {
          'ol-vendor': ['ol'],
          'react-vendor': ['react', 'react-dom'],
          'icons-vendor': ['lucide-react']
        }
      }
    }
  }
});

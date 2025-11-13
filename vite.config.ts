import { defineConfig } from 'vite';

export default defineConfig({
  // Base public path when served in development or production
  base: './',

  // Build configuration
  build: {
    outDir: 'dist',
    // Generate sourcemaps for debugging production build
    sourcemap: true,
    // Target modern browsers
    target: 'es2020',
  },

  // Development server configuration
  server: {
    port: 5173,
    // Automatically open browser on server start
    open: true,
  },

  // Preview server configuration (for testing production build locally)
  preview: {
    port: 5173,
  },
});

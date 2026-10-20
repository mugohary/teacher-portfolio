import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';
import tailwindcss from '@tailwindcss/vite';

/**
 * Vite configuration — deliberately minimal.
 * No plugin sprawl: Tailwind v4 (Vite plugin) + path aliases only.
 */
export default defineConfig({
  // BASE_PATH lets GitHub Project Pages build at /repo-name/ (see deploy.yml).
  base: process.env.BASE_PATH || '/',
  plugins: [tailwindcss()],
  resolve: {
    alias: {
      '@core': fileURLToPath(new URL('./src/core', import.meta.url)),
      '@modules': fileURLToPath(new URL('./src/modules', import.meta.url)),
      '@data': fileURLToPath(new URL('./src/data', import.meta.url)),
    },
  },
  build: {
    target: 'es2022',
    cssCodeSplit: true,
    assetsInlineLimit: 2048,
    sourcemap: false,
    reportCompressedSize: false,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  server: {
    port: 5173,
    open: false,
  },
});

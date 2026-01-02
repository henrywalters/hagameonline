// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    build: {
      minify: 'esbuild',
      target: 'esnext',
    },
    esbuild: {
      keepNames: true,  // ← This preserves class names!
    },
    ssr: {
      external: ['hagamets'],
    },
    optimizeDeps: {
      exclude: ['hagamets'],
    },
    resolve: {
      alias: {
        'ws': '/src/lib/ws-stub.js',
      },
    },
  }
});
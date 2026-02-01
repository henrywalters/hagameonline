// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone'
  }),
  image: {
    domains: ['hascape.sfo3.cdn.digitaloceanspaces.com']
  },
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
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { notFoundPage } from './scripts/not-found-plugin.js';

export default defineConfig({
  plugins: [react(), notFoundPage()],
  appType: 'mpa',
  base: process.env.VITE_BASE || '/',
  css: {
    postcss: {
      plugins: [
        {
          postcssPlugin: 'nov-public-assets-base',
          Once(root) {
            const base = process.env.VITE_BASE || '/';
            if (base === '/') return;
            root.walkDecls((decl) => {
              decl.value = decl.value.replaceAll(
                "url('/assets/",
                `url('${base}assets/`,
              );
            });
          },
        },
      ],
    },
  },
  server: { port: 5173, strictPort: true },
});

import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import compression from 'vite-plugin-compression';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [
      react(),
      // Gzip + Brotli for production — Netlify/Vercel serve pre-compressed files
      compression({ algorithm: 'gzip', ext: '.gz' }),
      compression({ algorithm: 'brotliCompress', ext: '.br' }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      // Inject <modulepreload> tags for async chunks so the browser fetches them early
      modulePreload: { polyfill: true },
      rollupOptions: {
        output: {
          manualChunks(id) {
            // Core React — always needed
            if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
              return 'vendor';
            }
            // Lenis smooth scroll — needed on desktop only, small chunk
            if (id.includes('node_modules/lenis')) {
              return 'lenis';
            }
            // GitHub calendar — only on About page
            if (id.includes('node_modules/react-github-calendar')) {
              return 'github';
            }
            // react-icons — large library, isolate it
            if (id.includes('node_modules/react-icons')) {
              return 'icons';
            }
          },
        },
      },
      chunkSizeWarningLimit: 800,
      cssCodeSplit: true,
      // Use esbuild for minification (built-in, no extra dep, faster than terser)
      minify: 'esbuild',
      target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'],
    },
  };
});

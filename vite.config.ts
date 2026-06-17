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
        compression({ algorithm: 'gzip', ext: '.gz' }),
        compression({ algorithm: 'brotliCompress', ext: '.br' }),
      ],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        rollupOptions: {
          output: {
            manualChunks: {
              vendor: ['react', 'react-dom'],
              icons: ['react-icons'],
              github: ['react-github-calendar'],
              lenis: ['lenis'],
            }
          }
        },
        chunkSizeWarningLimit: 1000
      }
    };
});

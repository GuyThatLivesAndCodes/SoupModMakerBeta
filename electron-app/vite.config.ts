import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import electron from 'vite-plugin-electron';
import * as path from 'path';

export default defineConfig({
  plugins: [
    react(),
    electron({
      entry: 'src/main/index.ts',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@core': path.resolve(__dirname, '../core/src'),
    },
  },
  server: {
    port: 5173,
  },
});

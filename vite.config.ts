// vite.config.ts

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [
        tailwindcss,
        autoprefixer,
      ],
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          antd: ['antd'],
          tailwind: ['tailwindcss', 'autoprefixer'],
          // 可以根据需要添加更多的手动分块
        },
      },
    },
    chunkSizeWarningLimit: 1000, // 增加警告阈值到 1000 kB
  },
});
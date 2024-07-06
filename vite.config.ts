// vite.config.ts

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".css", ".less"],
  },
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          antd: ["antd"]
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    minify: 'esbuild', // 使用 ESBuild 进行压缩
    target: 'es2015', // 指定目标环境
    cssMinify: 'esbuild', // 使用 ESBuild 压缩 CSS
  },
  server: {
    port: 3000,
    open: true,
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom", "antd"],
  },
  esbuild: {
    // ESBuild 选项
    drop: ['console', 'debugger'], // 移除 console 和 debugger
  },
});
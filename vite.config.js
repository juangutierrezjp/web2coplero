import { defineConfig } from 'vite'

export default defineConfig({
  base: '/',
  server: {
    port: 5174,
    open: true,
  },
  build: {
    outDir: 'dist',
    assetsInlineLimit: 4096,
    rollupOptions: {
      input: {
        main: 'index.html',
        brandbook: 'brandbook.html',
      }
    }
  },
  // SPA-like fallback for dev server
  preview: {
    port: 4173,
  }
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: [
      { find: '@app', replacement: resolve(__dirname, 'src/app') },
      { find: '@pages', replacement: resolve(__dirname, 'src/pages') },
      { find: '@widgets', replacement: resolve(__dirname, 'src/widgets') },
      { find: '@features', replacement: resolve(__dirname, 'src/features') },
      { find: '@entities', replacement: resolve(__dirname, 'src/entities') },
      { find: '@shared', replacement: resolve(__dirname, 'src/shared') },
      { find: '@', replacement: resolve(__dirname, 'src') },
    ],
  },
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    tailwindcss(),
  ],
  server: {
    host: true,
    port: 5173,
    watch: {
      usePolling: true
    }
  }
})

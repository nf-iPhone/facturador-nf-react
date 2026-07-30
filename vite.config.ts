import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/',
  resolve: {
    alias: {
      // Tailwind v4 usa oklch(); html2canvas clásico falla. html2canvas-pro lo soporta.
      html2canvas: path.resolve(__dirname, 'node_modules/html2canvas-pro'),
    },
  },
  optimizeDeps: {
    include: ['html2canvas-pro'],
  },
})
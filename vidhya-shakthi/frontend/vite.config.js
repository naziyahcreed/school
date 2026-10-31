import path from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const lmsRoot = path.resolve(__dirname, '../../site-learning-lms-latex')

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@lms': path.join(lmsRoot, 'src'),
      '@lms-root': lmsRoot,
    },
  },
  server: {
    fs: {
      allow: [__dirname, lmsRoot],
    },
  },
})

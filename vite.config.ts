import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import blog from './blog.vite.ts'

export default defineConfig({
  plugins: [react(), tailwindcss(), blog()],
})

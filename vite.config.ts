import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import sitePages from './site-pages.vite.ts'

export default defineConfig({
  plugins: [react(), tailwindcss(), sitePages()],
})

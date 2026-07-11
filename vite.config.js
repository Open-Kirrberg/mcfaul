import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Served from https://open-kirrberg.github.io/mcfaul/ on GitHub Pages.
  base: '/mcfaul/',
  plugins: [react()],
})

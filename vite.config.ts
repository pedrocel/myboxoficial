import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Aceita VITE_* e NEXT_PUBLIC_* (comum ao copiar do Next.js / Cloudflare)
  envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
})

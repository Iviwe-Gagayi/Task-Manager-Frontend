import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react' // <-- 1. Import this

export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
  ],
})
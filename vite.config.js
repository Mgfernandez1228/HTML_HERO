import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],

  server: { // 🌟 This block is crucial 🌟
      proxy: {
        '/api': {
          target: 'http://localhost:3000', // Points to your Express API
          changeOrigin: true,
          secure: false,
        },
      },
    },

})

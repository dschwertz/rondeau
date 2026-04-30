import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    tailwindcss()
  ],
  server: {
    proxy: {
      '/v0': {
        target: 'https://dev.rondeau.dillonschwertz.dev',
        changeOrigin: true,
        secure: true,
      }
    }
  }
})

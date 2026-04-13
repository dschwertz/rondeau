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
        target: 'https://bxqv074999.execute-api.us-west-2.amazonaws.com',
        changeOrigin: true,
        secure: true,
      }
    }
  }
})

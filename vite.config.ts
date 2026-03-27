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
      '/dev': {
        target: 'https://rneeu4m1q5.execute-api.us-west-2.amazonaws.com',
        changeOrigin: true,
        secure: true,
      }
    }
  }
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    host:true,
    allowedHosts:['c4b9f9fa0991.ngrok-free.app'],
  },
})

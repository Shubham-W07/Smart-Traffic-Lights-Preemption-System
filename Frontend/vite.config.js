import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// import fs from 'fs'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    
    /* For Notifiacation Sending  */
    // https: {
    //   key: fs.readFileSync('C:\\Users\\shubh\\OneDrive\\Documents\\BTECH_PROJECT\\Version 6\\Server\\localhost-key.pem'),
    //   cert: fs.readFileSync('C:\\Users\\shubh\\OneDrive\\Documents\\BTECH_PROJECT\\Version 6\\Server\\localhost.pem'),
    // },
    // host: 'localhost',

    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
  },
})


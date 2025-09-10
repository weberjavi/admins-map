import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      // Enable proper headers for PMTiles files
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Range',
    },
  },
  preview: {
    headers: {
      // Enable proper headers for PMTiles files in preview mode
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Range',
    },
  },
})

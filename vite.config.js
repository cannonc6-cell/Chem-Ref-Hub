import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'ChemRef Hub',
        short_name: 'ChemRef',
        description: 'Chemical Reference & Logbook',
        theme_color: '#2A5C5E',
        icons: [
          {
            src: 'assets/logo.svg',
            sizes: '192x192',
            type: 'image/svg+xml'
          },
          {
            src: 'assets/logo.svg',
            sizes: '512x512',
            type: 'image/svg+xml'
          }
        ]
      }
    })
  ],
  server: {
    host: '0.0.0.0', // Listen on all network interfaces
    port: 5173,
  }
})

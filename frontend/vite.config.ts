import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import tailwindcss from 'tailwindcss'
// import autoprefixer from 'autoprefixer'
// import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // VitePWA({
    //   registerType: 'autoUpdate',
    //   includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
    //   manifest: {
    //     name: 'ConoSERnos',
    //     short_name: 'ConoSERnos',
    //     description: 'Juego de cartas para conectar',
    //     theme_color: '#ecfeff',
    //     icons: [
    //       {
    //         src: 'pwa-192x192.png',
    //         sizes: '192x192',
    //         type: 'image/png'
    //       },
    //       {
    //         src: 'pwa-512x512.png',
    //         sizes: '512x512',
    //         type: 'image/png'
    //       }
    //     ]
    //   }
    // })
  ],
  server: {
    host: true, // Esto exponer la app en la red local (0.0.0.0)
    strictPort: true,
    port: 5173,
    watch: {
      usePolling: true, // Vital para Hot Reload en Windows con Docker
    },
  },
})

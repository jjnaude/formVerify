import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'formVerify',
        short_name: 'formVerify',
        description: 'Verify handwritten form fields using camera capture and OCR',
        theme_color: '#1a73e8',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,wasm,png}'],
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // 10MB for OpenCV WASM
      },
    }),
  ],
  server: {
    host: true,
  },
});

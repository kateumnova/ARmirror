// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/ARmirror/',

  plugins: [
    react(),

    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
      },

      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/(?:cf-st|bolt-gcdn)\.sc-cdn\.net/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'camera-kit-assets',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 7,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },

          {
            urlPattern: /^https:\/\/.*\.snapar\.com/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'snapar-api',
              expiration: {
                maxAgeSeconds: 60 * 60,
              },
            },
          },
        ],
      },
    }),
  ],
});

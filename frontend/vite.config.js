// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // 👈 Required to expose to local network (mobile access)
    port: 5180,
    proxy: {
      '/api': {
        target: 'http://localhost:5180',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

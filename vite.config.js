
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import { defineConfig } from 'vite';
export default defineConfig({
  server: {
    port: 5000,
    https: {
      key: fs.readFileSync('./.cert/key.pem'),
      cert: fs.readFileSync('./.cert/cert.pem'),
    },
  },
  plugins: [react(),
  tailwindcss(),
  ],
  define: {
    'process.env': process.env
  }


});


import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Needed for the Docker Container port mapping to work IF we have the Dockerfile doing "npm run dev".
    // Otherwise, the build will just create the index.html that nginx.conf takes care of
    host: true,
    strictPort: true,
    port: 8080,
  },
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// Everything the api owns. The callback paths matter: miss them and an oidc login
// dead ends on a vite 404.
const apiPaths = [
  '/api',
  '/auth',
  '/movie-images',
  '/signin-oidc',
  '/signout-oidc',
  '/signout-callback-oidc',
]

// Point this at ./mock-api (http://localhost:5000) to work on the ui alone.
const apiUrl = process.env.API_URL || 'http://localhost:5266'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 3000,
    // changeOrigin stays off so the api sees the host the browser used and builds
    // the right oidc redirect uri.
    proxy: Object.fromEntries(apiPaths.map((path) => [path, apiUrl])),
  },
})

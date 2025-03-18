import { defineConfig } from 'vite' 
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  server:{
    port : 3000,
    proxy: {
      "/api":
      {
        target: "http://localhost:8800",
        changeOrigin: true,
      },

    },
  },
});

// A proxy in vite is used to redirect Api request request from your front-end (react) to a backend server without CORS isuue

// When your React app (running on localhost:5173) tries to fetch data from a back-end server (localhost:5000), the browser blocks it due to CORS policy.
// A proxy helps bypass this restriction by rerouting API calls through the development server.



// vite.config.js (in root of vite-project)
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://localhost:5555",  // your backend port
    },
  },
});

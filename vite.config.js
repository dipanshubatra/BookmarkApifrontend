import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { API_BASE } from "./src/api/apiBase.js";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: API_BASE,
        changeOrigin: true,
        secure: true
      }
    }
  }
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5173, // porta do servidor de desenvolvimento
    open: true, // abre automaticamente no navegador
    proxy: {
      "/api/v1/estoque": {
        target: "http://localhost:5020",
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      "@": "/src", // facilita imports absolutos do src
    },
  },
});


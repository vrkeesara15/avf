/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Proxy API calls to the backend during local development so the client
    // can use same-origin "/api" paths (matching the production setup).
    proxy: {
      "/api": {
        target: process.env.VITE_API_TARGET ?? "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    css: false,
    restoreMocks: true,
    // Client (frontend) tests only — the backend has its own suite in /server.
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["server/**", "node_modules/**", "dist/**"],
  },
});

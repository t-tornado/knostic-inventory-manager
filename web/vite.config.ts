import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/features": path.resolve(__dirname, "./src/features"),
      "@/core": path.resolve(__dirname, "./src/core"),
      "@/shared": path.resolve(__dirname, "./src/shared"),
      "@/app": path.resolve(__dirname, "./src/app"),
      "@/infrastructure": path.resolve(__dirname, "./src/infrastructure"),
      cypress: path.resolve(__dirname, "./cypress"),
    },
  },
});

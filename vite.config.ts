import path from "path"
import react from "@vitejs/plugin-react"
import svgr from 'vite-plugin-svgr';
import dts from 'vite-plugin-dts'
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react(), svgr(), dts()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
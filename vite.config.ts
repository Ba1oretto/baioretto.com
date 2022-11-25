// noinspection JSUnusedGlobalSymbols

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [ react() ],
  server: {
    proxy: {
      "/test/api": {
        target: "https://reqres.in/api/",
        changeOrigin: true,
        // rewrite: path => path.replace(/^\/baioretto/, '')
        rewrite: path => path.replace(/^\/test\/api/, ""),
      },
    },
  },
});

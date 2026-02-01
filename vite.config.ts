import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    proxy: {
      "/api/about": {
        target: "https://storage.googleapis.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/about/, "/qlawmarq.net/pages"),
      },
    },
  },
});

import { fileURLToPath, URL } from "url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    proxy: {
      "/api":
        {
          target: "https://mevnserver.ovmkas.co.kr",
          changeOrigin: true,
          pathRewrite: {
            '^/api': ''
          },
          //   },
          // "/signup": "http://localhost:8080", // 프록시 설정\
          // "/auth/login": "http://localhost:8080",
        },
    },
  }
});

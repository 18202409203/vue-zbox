import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "ZBox",
      formats: ["es", "umd"],
      fileName: (format) => "zbox." + format + ".js",
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        globals: {
          vue: "Vue",
        },
        exports: "named",
      },
    },
    cssCodeSplit: false,
  },
  publicDir: false,
});

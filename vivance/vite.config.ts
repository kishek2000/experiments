import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { copyFileSync } from "fs";
import { join } from "path";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "copy-redirects",
      closeBundle() {
        // Copy _redirects to build output after build
        try {
          copyFileSync(
            join(process.cwd(), "public", "_redirects"),
            join(process.cwd(), "build", "client", "_redirects")
          );
        } catch (err) {
          // File might not exist, that's okay
        }
      },
    },
  ],
  build: {
    outDir: "build/client",
    emptyOutDir: true,
  },
});

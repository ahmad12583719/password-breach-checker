import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";

function managedAssetProxy(): Plugin {
  return {
    name: "managed-asset-proxy",
    configureServer(server) {
      server.middlewares.use("/manus-storage", async (request, response) => {
        const key = request.url?.replace(/^\//, "");
        const apiUrl = process.env.BUILT_IN_FORGE_API_URL?.replace(/\/+$/, "");
        const apiKey = process.env.BUILT_IN_FORGE_API_KEY;

        if (!key || !apiUrl || !apiKey) {
          response.writeHead(404).end();
          return;
        }

        try {
          const upstream = new URL("v1/storage/presign/get", `${apiUrl}/`);
          upstream.searchParams.set("path", key);
          const result = await fetch(upstream, { headers: { Authorization: `Bearer ${apiKey}` } });
          const { url } = (await result.json()) as { url?: string };
          if (!result.ok || !url) throw new Error("Managed asset unavailable");
          response.writeHead(307, { Location: url, "Cache-Control": "no-store" }).end();
        } catch {
          response.writeHead(502).end();
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), managedAssetProxy()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    host: true,
    port: 3000,
    strictPort: false,
  },
});

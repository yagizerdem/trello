import { defineConfig } from "@solidjs/start/config";

export default defineConfig({
  solid: {
    babel: {
      plugins: [["@babel/plugin-syntax-decorators", { legacy: true }]],
    },
  } as any,
  //   vite: {
  //     plugins: [tscPlugin({})],
  //   },
  middleware: "./src/middleware.ts",
  server: {
    experimental: {
      websocket: true,
    },
  },
}).addRouter({
  name: "ws",
  type: "http",
  handler: "./src/ws.ts",
  target: "server",
  base: "/ws",
});

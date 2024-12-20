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
});

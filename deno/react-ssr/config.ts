import type { Config } from "ssr";

export default <Config> {
  esbuild: {
    entryPoints: {
      twind: "nhttp/jsx/twind.ts",
    },
  },
  routeDirName: "routes",
  cacheControl: "public, max-age=31536000, immutable",
};

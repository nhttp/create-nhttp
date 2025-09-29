import type { Config } from "./_core/ssr.js";

export default <Config> {
  esbuild: {
    entryPoints: {},
  },
  routeDirName: "routes",
  cacheControl: "public, max-age=31536000, immutable",
};

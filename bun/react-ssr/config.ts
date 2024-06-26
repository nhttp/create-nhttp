import type { Config } from "@nhttp/ssr";

export default <Config> {
  esbuild: {
    entryPoints: {},
  },
  routeDirName: "routes",
  cacheControl: "public, max-age=31536000, immutable",
};

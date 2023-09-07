import type { Config } from "ssr";

export default <Config> {
  esbuild: {
    entryPoints: {
      twind: "nhttp-land/jsx/twind",
    },
  },
  routeDirName: "routes",
  cacheControl: "public, max-age=31536000, immutable",
};

import type { Config } from "ssr";

export default <Config> {
  esbuild: {
    entryPoints: {
      preact_hooks: "preact/hooks",
      twind: "nhttp-land/jsx/twind",
    },
  },
  routeDirName: "routes",
  cacheControl: "public, max-age=31536000, immutable",
};

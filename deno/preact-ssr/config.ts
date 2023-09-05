import type { Config } from "ssr";

export default <Config> {
  esbuild: {
    entryPoints: {
      preact_hooks: "preact/hooks",
    },
  },
  routeDirName: "routes",
  cacheControl: "public, max-age=31536000, immutable",
};

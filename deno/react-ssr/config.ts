import type { Config } from "ssr";

export default <Config> {
  routeDirName: "routes",
  cacheControl: "public, max-age=31536000, immutable",
};

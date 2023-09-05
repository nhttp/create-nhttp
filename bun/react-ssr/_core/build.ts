import "../app.ts";
import { STORE } from "./hydrate.ts";
import { configEsbuild, esbuild, isEmptyObj } from "./ssr.ts";
import fs from "node:fs";
try {
  fs.rmSync("build", { recursive: true });
} catch { /* noop */ }
configEsbuild.define ??= {};
configEsbuild.define["process.env.NODE_ENV"] = '"production"';
if (!isEmptyObj(STORE)) {
  Object.assign(configEsbuild.entryPoints as Record<string, string>, STORE);
  try {
    configEsbuild.outdir = "build";
    await esbuild.build(configEsbuild);
    const sample = Object.keys(STORE)[0];
    fs.writeFileSync(
      "build/build_id.txt",
      sample.substring(sample.lastIndexOf(".") + 1),
    );
    console.log("Success build...");
  } catch (error) {
    console.log(error);
  }
} else {
  console.log("Success build. with no hydration components");
}

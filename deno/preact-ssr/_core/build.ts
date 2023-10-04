import "../app.ts";
import { STORE } from "hydrate";
import { configEsbuild, esbuild, isEmptyObj } from "ssr";
try {
  await Deno.remove("build", { recursive: true });
} catch { /* noop */ }

if (!isEmptyObj(STORE)) {
  Object.assign(configEsbuild.entryPoints as Record<string, string>, STORE);
  try {
    configEsbuild.outdir = "build";
    await esbuild.build(configEsbuild);
    esbuild.stop();
    const sample = Object.keys(STORE)[0];
    Deno.writeTextFileSync(
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

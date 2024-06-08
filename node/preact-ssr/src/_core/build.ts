import "../app.js";
import { STORE } from "./hydrate.js";
import { configEsbuild, esbuild, isEmptyObj } from "./ssr.js";
import fs from "node:fs";
try {
    fs.rmSync("./dist/build", { recursive: true });
}
catch { /* noop */ }
configEsbuild.define ??= {};
configEsbuild.define["process.env.NODE_ENV"] = '"production"';
if (!isEmptyObj(STORE)) {
    Object.assign(configEsbuild.entryPoints, STORE);
    try {
        configEsbuild.outdir = "dist/build";
        await esbuild.build(configEsbuild);
        const sample = Object.keys(STORE)[0];
        fs.writeFileSync("./dist/build/build_id.txt", sample.substring(sample.lastIndexOf(".") + 1));
        console.log("Success build...");
    }
    catch (error) {
        console.log(error);
    }
}
else {
    console.log("Success build. with no hydration components");
}

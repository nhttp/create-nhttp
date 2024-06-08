import { getRouteFromDir } from "@nhttp/nhttp/file-router";
import config from "../config.js";
import fs from "node:fs";
async function buildRoutes() {
    const route = await getRouteFromDir("dist/" + config.routeDirName);
    const arr = Object.keys(route);
    const str = `${arr.map((k, i) => `import $${i} from "./../${route[k].replace("dist/", "")}";\n`).join("")}
function findCustomPath(key) {
  if (key[1] === "_") return key.slice(2);
}
const gen = (app, path, mod) => {
  if (typeof mod === "object" && mod.pop === void 0) {
    for (const method in mod) {
      app.on(method, path, mod[method]);
    }
  } else {
    const name = findCustomPath(path);
    if (name === "404") app.on404(mod);
    else if (name === "error") app.onError(mod);
    else app.get(path, mod);
  }
};
export default (app) => {
  ${arr.map((k, i) => `gen(app, "${k}", $${i});\n`).join("  ")}};`;
    await fs.promises.writeFile("./dist/_core/router.js", str);
}
await buildRoutes();

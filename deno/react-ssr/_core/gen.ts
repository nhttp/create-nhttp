import { getRouteFromDir } from "nhttp/file-router.ts";
import config from "../config.ts";

async function buildRoutes() {
  const route = await getRouteFromDir(config.routeDirName);
  const arr = Object.keys(route);
  const str = `${
    arr.map((k, i) => `import $${i} from "./../${route[k]}";\n`).join("")
  }
// deno-lint-ignore no-explicit-any
type TAny = any;
function findCustomPath(key: string) {
  if (key[1] === "_") return key.slice(2);
}
const gen = (app: TAny, path: string, mod: TAny) => {
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
export default (app: TAny) => {
  ${arr.map((k, i) => `gen(app, "${k}", $${i});\n`).join("  ")}};`;
  await Deno.writeTextFile("_core/router.ts", str);
}

await buildRoutes();

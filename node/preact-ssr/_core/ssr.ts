import esbuild from "esbuild";
import { Helmet, options, renderToHtml } from "nhttp-land/jsx";
import { serveStatic } from "nhttp-land/serve-static";
import { renderToString } from "preact-render-to-string";
import { NHttp, RequestEvent, TApp } from "nhttp-land";
import { tt as timestamps } from "./hydrate.ts";
import { getRouteFromDir } from "nhttp-land/file-router";
import createRouter from "./router.ts";
import config from "../config.ts";
import fs from "node:fs";

export { esbuild };

export type Config = {
  esbuild?: esbuild.BuildOptions;
  routeDirName: string;
  cacheControl?: string;
};
config.esbuild ??= {};
config.esbuild.entryPoints ??= {};

let tt = timestamps;

// deno-lint-ignore no-explicit-any
type TAny = any;

const args = process.argv.slice(2);

export const isDev = args.includes("--dev");
let isBuild = false;
if (isDev === false) {
  try {
    isBuild = fs.statSync("build").isDirectory();
    tt = parseInt(fs.readFileSync("build/build_id.txt", { encoding: "utf-8" }));
  } catch { /* noop */ }
}
config.esbuild.entryPoints["hydrate"] = "./_core/hydrate.ts";
if (config.esbuild.entryPoints["preact"] === void 0) {
  config.esbuild.entryPoints["preact"] = "preact";
}
export const configEsbuild: esbuild.BuildOptions = {
  absWorkingDir: process.cwd(),
  format: "esm",
  bundle: true,
  platform: "neutral",
  treeShaking: true,
  target: [
    "es2020",
    "chrome64",
    "edge79",
    "firefox62",
    "safari11.1",
  ],
  minify: true,
  splitting: true,
  outdir: ".",
  jsx: "automatic",
  jsxImportSource: "preact",
  ...config.esbuild,
};
export function isEmptyObj(props: TAny) {
  if (!props) return false;
  for (const _ in props) return false;
  return true;
}

const toPathname = (path: string) => path.slice(path.lastIndexOf("/"));
const setHeader = (rev: RequestEvent) => {
  rev.response.type("js");
  if (config.cacheControl) {
    rev.response.setHeader(
      "cache-control",
      config.cacheControl,
    );
  }
};
export class SSRApp extends NHttp {
  #cache: Record<string, {
    entry: Record<string, string>;
    src: string[];
    route: Record<string, boolean>;
    stat?: number;
  }> = {};
  constructor(opts: TApp = {}) {
    super(opts);
    this.use(
      "/assets",
      serveStatic("public", { etag: true }),
    );
    if (isBuild) {
      this.use(
        "/app",
        serveStatic("build", {
          setHeaders(rev) {
            if (config.cacheControl) {
              rev.response.setHeader(
                "cache-control",
                config.cacheControl,
              );
            }
          },
        }),
      );
    }
    if (isDev) {
      this.get("/__REFRESH__", ({ response }) => {
        response.type("text/event-stream");
        return new ReadableStream({
          start(controller) {
            controller.enqueue(`data: reload\nretry: 100\n\n`);
          },
          cancel(err) {
            console.log(err || "Error ReadableStream");
          },
        }).pipeThrough(new TextEncoderStream());
      });
      this.get(`/dev.${tt}.js`, (rev) => {
        setHeader(rev);
        return `(() => {let bool = false; new EventSource("/__REFRESH__").addEventListener("message", _ => {if (bool) location.reload(); else bool = true;});})();`;
      });
    }
    options.onRenderElement = (elem, rev) => {
      const key = isBuild
        ? "NHTTP_BUILD_PACK"
        : rev.method + (rev.route.path ?? rev.path).toString();
      Helmet.render = renderToString as TAny;
      const body = renderToString(elem);
      let src = this.#cache[key]?.src;
      if (src === void 0) {
        this.#cache[key] = {
          entry: {},
          src: [],
          route: {},
        };
      }
      src = this.#cache[key].src = this.#getSource(
        elem,
        key,
      ) as string[];
      if (isDev) src = [`<script src="/dev.${tt}.js"></script>`].concat(src);
      if (src.length) {
        const last = Helmet.writeFooterTag?.() ?? [];
        Helmet.writeFooterTag = () => [
          ...src as string[],
          ...last,
        ];
        if (this.#cache[key].stat === undefined && isBuild === false) {
          return this.#bundle(key).then(() => body);
        }
      }
      return body;
    };
    this.engine(renderToHtml);
  }
  #findNode = (elem: JSX.Element) => {
    let arr = [] as TAny;
    let childs = elem.props?.children ?? [];
    if (!childs.pop) childs = [childs];
    for (let i = 0; i < childs.length; i++) {
      const child = childs[i];
      if (child?.props?.children) {
        arr = arr.concat(this.#findNode(child));
      } else if (child.type?.meta_url) {
        arr.push(child);
      }
    }
    return arr;
  };
  #getSource = (elem: JSX.Element, key: string) => {
    const fn = elem.type as TAny;
    const main = fn?.meta_url;
    let src: TAny[] = [];
    if (main) {
      const props = elem.props;
      if (!isEmptyObj(props)) {
        if (props?.children) props.children = void 0;
        src.push(
          `<script id="p-${fn.hash}" type="application/json">${
            JSON.stringify(props)
          }</script>`,
        );
      }
      const name = `${fn.hash}.${tt}`;
      const path = `/${name}.js`;
      src.push(`<script type="module" src="/app${path}" async></script>`);
      if (this.#cache[key].route[path] === void 0) {
        this.#cache[key].entry[name] = fn.meta_url;
      }
    } else {
      const arr: JSX.Element[] = this.#findNode(elem);
      arr.forEach((elem) => {
        src = src.concat(this.#getSource(elem, key));
      });
    }
    return src;
  };
  #bundle = async (key: string) => {
    Object.assign(configEsbuild.entryPoints as TAny, this.#cache[key].entry);
    try {
      const res = await esbuild.build({
        ...configEsbuild,
        write: false,
      });
      const files = res.outputFiles;
      files.forEach(({ path, contents }: TAny) => {
        path = toPathname(path);
        if (this.#cache[key].route[path] === void 0) {
          this.get("/app" + path, (rev) => {
            setHeader(rev);
            return contents;
          });
          this.#cache[key].route[path] = true;
        }
      });
      this.#cache[key].stat = 1;
    } catch (err) {
      console.error(err);
    }
  };
}
function findCustomPath(key: string) {
  if (key[1] === "_") return key.slice(2);
}
export const dynamicRoute = async (
  app: SSRApp,
  meta: string,
) => {
  if (isDev) {
    const url = new URL(".", meta).pathname;
    const route = await getRouteFromDir(config.routeDirName);
    for (const key in route) {
      const mod = (await import(url + route[key]))?.default;
      if (typeof mod === "object" && mod.pop === void 0) {
        for (const method in mod) {
          app.on(method, key, mod[method]);
        }
      } else {
        const name = findCustomPath(key);
        if (name === "404") app.on404(mod);
        else if (name === "error") app.onError(mod);
        else app.get(key, mod);
      }
    }
  } else {
    createRouter?.(app);
  }
};

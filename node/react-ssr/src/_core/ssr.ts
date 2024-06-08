import esbuild from "esbuild";
import {
  Helmet,
  type JSXElement,
  n,
  options,
  renderToHtml,
} from "@nhttp/nhttp/jsx";
import { serveStatic } from "@nhttp/nhttp/serve-static";
import { renderToString } from "react-dom/server";
import { NHttp, RequestEvent, TApp } from "@nhttp/nhttp";
import { tt as timestamps } from "./hydrate.js";
import { getRouteFromDir } from "@nhttp/nhttp/file-router";
import createRouter from "./router.js";
import config from "../config.js";
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
config.esbuild.entryPoints["@nhttp/hydrate"] = "@nhttp/hydrate";
if (config.esbuild.entryPoints["react"] === void 0) {
  config.esbuild.entryPoints["react"] = "react";
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
  jsxImportSource: "react",
  define: {
    "process.env.NODE_ENV": '"development"',
  },
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
    src: JSXElement[];
    route: Record<string, boolean>;
    stat?: number;
  }> = {};
  constructor(opts: TApp = {}) {
    super(opts);
    this.use(
      "/assets",
      serveStatic(new URL("../../public", import.meta.url), { etag: true }),
    );
    if (isBuild) {
      this.use(
        "/app",
        serveStatic(new URL("../build", import.meta.url), {
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
        }).pipeThrough(new TextEncoderStream());
      });
      this.get(`/dev.${tt}.js`, (rev) => {
        setHeader(rev);
        return `(() => {let bool = false; new EventSource("/__REFRESH__").addEventListener("message", _ => {if (bool) location.reload(); else bool = true;});})();`;
      });
    }
    options.onRenderElement = async (elem, rev) => {
      const key = isBuild
        ? "NHTTP_BUILD_PACK"
        : rev.method + (rev.route.path ?? rev.path).toString();
      const body = renderToString(elem as TAny);
      let src = this.#cache[key]?.src;
      if (src === void 0) {
        this.#cache[key] = {
          entry: {},
          src: [],
          route: {},
        };
      }
      src = this.#cache[key].src = this.#getSource(
        elem as JSXElement,
        key,
      );
      if (isDev) src = [n("script", { src: `/dev.${tt}.js` })].concat(src);
      if (src.length) {
        const last = Helmet.writeFooterTag?.() ?? [];
        Helmet.writeFooterTag = () => [
          ...src as JSX.Element[],
          ...last,
        ];
        if (this.#cache[key].stat === undefined && isBuild === false) {
          await this.#bundle(key);
        }
      }
      return body;
    };
    this.engine(renderToHtml);
  }
  #findNode = (elem: JSXElement) => {
    let arr = [] as TAny;
    // deno-lint-ignore no-explicit-any
    let childs = (elem.props as any)?.children ?? [];
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
  #getSource = (elem: JSXElement, key: string) => {
    const fn = elem.type as TAny;
    const main = fn?.meta_url;
    let src: TAny[] = [];
    if (main) {
      // deno-lint-ignore no-explicit-any
      const props = elem.props as any;
      if (!isEmptyObj(props)) {
        if (props?.children) props.children = void 0;
        src.push(n("script", {
          type: "application/json",
          id: `p-${fn.hash}`,
          dangerouslySetInnerHTML: {
            __html: JSON.stringify(props),
          },
        }));
      }
      const name = `${fn.hash}.${tt}`;
      const path = `/${name}.js`;
      src.push(n("script", {
        type: "module",
        src: `/app${path}`,
        async: true,
      }));
      if (this.#cache[key].route[path] === void 0) {
        this.#cache[key].entry[name] = fn.meta_url;
      }
    } else {
      const arr: JSXElement[] = this.#findNode(elem);
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
    const url = new URL("../", meta).pathname;
    const route = await getRouteFromDir("src/" + config.routeDirName);
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

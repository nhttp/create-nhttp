import { NHttp } from "@nhttp/nhttp";
import { renderToString } from "vue/server-renderer";
import { createSSRApp } from "vue";
import { glob } from "glob";
import esbuild from "esbuild";
import vue from "esbuild-plugin-vue-next";
import fs from "node:fs";

const app = new NHttp();

const render = async (file: string, props: Record<string, any>) => {
  const component = (await import(file)).default;
  const app = createSSRApp(component, props);
  const html = await renderToString(app);
  return `<!DOCTYPE html><html><head><title>Vue SSR</title></head><body>${html}</body></html>`;
};

const build = async () => {
  const files = await glob("routes/**/*.vue");
  const entryPoints = files.reduce((acc, file) => {
    acc[file.replace(".vue", "")] = file;
    return acc;
  }, {} as Record<string, string>);

  await esbuild.build({
    entryPoints,
    bundle: true,
    format: "esm",
    platform: "node",
    outdir: "dist",
    plugins: [vue()],
  });
};

if (process.argv.includes("--build")) {
  await build();
  process.exit(0);
}

app.get("/*", async ({ path, response }) => {
  const file = `./routes${path === "/" ? "/index" : path}.vue`;
  if (!fs.existsSync(file)) {
    return response.status(404).send("Not Found");
  }
  const html = await render(file, {});
  return response.send(html);
});

export default app;
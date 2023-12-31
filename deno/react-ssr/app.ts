import { dynamicRoute, SSRApp } from "ssr";
import { useTwind } from "nhttp/jsx/twind.ts";

useTwind();

const app = new SSRApp();

await dynamicRoute(app, import.meta.url);

export default app;

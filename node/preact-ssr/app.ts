import { dynamicRoute, SSRApp } from "ssr";
import { useTwind } from "nhttp-land/jsx/twind";

useTwind();

const app = new SSRApp();

await dynamicRoute(app, import.meta.url);

export default app;

import { dynamicRoute, SSRApp } from "@nhttp/ssr";
import { useTwind } from "@nhttp/nhttp/jsx/twind";

useTwind();

const app = new SSRApp();

await dynamicRoute(app, import.meta.url);

export default app;

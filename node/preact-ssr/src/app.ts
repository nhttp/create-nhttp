import { dynamicRoute, SSRApp } from "@nhttp/ssr";
import { twind } from "@nhttp/nhttp/jsx/twind";

const app = new SSRApp();

app.use(twind());

await dynamicRoute(app, import.meta.url);

export default app;

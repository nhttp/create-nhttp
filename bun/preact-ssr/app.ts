import { dynamicRoute, SSRApp } from "ssr";
import { install, useTwind } from "nhttp-land/jsx/twind";

install({ hash: (c) => c });
useTwind();

const app = new SSRApp();

await dynamicRoute(app, import.meta.url);

export default app;

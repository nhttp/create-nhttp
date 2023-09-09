import { renderToHtml } from "nhttp/jsx.ts";
import { serveStatic } from "nhttp/serve-static.ts";
import { NHttp, TApp } from "nhttp";
import HomeController from "controllers/home_controller.tsx";
import UserController from "controllers/user_controller.tsx";
import { install, useTwind } from "nhttp/jsx/twind.ts";

// twind ssr
install({ hash: (c) => c });
useTwind();

export default class Application extends NHttp {
  constructor(options?: TApp) {
    super(options);

    // assets
    this.use("/assets", serveStatic("public", { etag: true }));

    // engine jsx
    this.engine(renderToHtml);

    // register controllers
    this.use([
      new HomeController(),
      new UserController(),
    ]);
  }
}

import { renderToHtml } from "@nhttp/nhttp/jsx";
import { serveStatic } from "@nhttp/nhttp/serve-static";
import { NHttp, TApp } from "@nhttp/nhttp";
import HomeController from "controllers/home_controller.js";
import UserController from "controllers/user_controller.js";
import { twind } from "@nhttp/nhttp/jsx/twind";

export default class Application extends NHttp {
  constructor(options?: TApp) {
    super(options);

    // assets
    this.use("/assets", serveStatic("public", { etag: true }));

    // engine jsx
    this.engine(renderToHtml).use(twind());

    // register controllers
    this.use([
      new HomeController(),
      new UserController(),
    ]);
  }
}

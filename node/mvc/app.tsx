import { renderToHtml } from "nhttp-land/jsx";
import { serveStatic } from "nhttp-land/serve-static";
import { NHttp, TApp } from "nhttp-land";
import HomeController from "controllers/home_controller.tsx";
import UserController from "controllers/user_controller.tsx";
import { useTwind } from "nhttp-land/jsx/twind";

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

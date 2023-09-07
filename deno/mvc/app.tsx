import { renderToHtml } from "nhttp/jsx.ts";
import { NHttp, TApp } from "nhttp";
import HomeController from "controllers/home_controller.tsx";
import UserController from "controllers/user_controller.tsx";
import { useTwind } from "nhttp/jsx/twind.ts";

export default class Application extends NHttp {
  constructor(options?: TApp) {
    super(options);

    // tailwind
    useTwind();

    // engine jsx
    this.engine(renderToHtml);

    // register controllers
    this.use([
      new HomeController(),
      new UserController(),
    ]);
  }
}

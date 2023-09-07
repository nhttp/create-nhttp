import { renderToHtml } from "nhttp-land/jsx";
import { NHttp, TApp } from "nhttp-land";
import HomeController from "controllers/home_controller.tsx";
import UserController from "controllers/user_controller.tsx";
import { useTwind } from "nhttp-land/jsx/twind";

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

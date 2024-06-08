import { Controller, Get } from "@nhttp/nhttp/controller";
import { HomeView } from "views/home_view.js";

@Controller("/")
class HomeController {
  @Get()
  index() {
    return <HomeView title="Home Page" />;
  }
}

export default HomeController;

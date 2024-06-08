import nhttp from "@nhttp/nhttp";

const homeRouter = nhttp.Router();

homeRouter.get("/", () => {
  return "hello, home";
});

export default homeRouter;

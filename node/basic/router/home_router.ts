import nhttp from "nhttp-land";

const homeRouter = nhttp.Router();

homeRouter.get("/", () => {
  return "hello, home";
});

export default homeRouter;

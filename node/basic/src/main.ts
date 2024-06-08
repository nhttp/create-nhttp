import nhttp from "@nhttp/nhttp";
import homeRouter from "./router/home_router.js";
import userRouter from "./router/user_router.js";

const app = nhttp();

app.use("/api/v1", [homeRouter, userRouter]);

app.listen(8000, (err, info) => {
  if (err) throw err;
  console.log(`> Running on port ${info.port}`);
});

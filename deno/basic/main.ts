import nhttp from "nhttp";
import homeRouter from "./router/home_router.ts";
import userRouter from "./router/user_router.ts";

const app = nhttp();

app.use("/api/v1", [homeRouter, userRouter]);

app.listen(8000, (err, info) => {
  if (err) throw err;
  console.log(`> Running on port ${info.port}`);
});

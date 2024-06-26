import nhttp from "@nhttp/nhttp";
import validate, { z } from "@nhttp/zod";

const users = ["john", "doe"];
const UserSchema = z.object({
  name: z.string(),
});

const userRouter = nhttp.Router({ base: "/user" });

userRouter.get("/", () => {
  return { data: users };
});

userRouter.post("/", validate(UserSchema), (rev) => {
  rev.response.status(201);
  const name = rev.body.name;
  users.push(name);
  return { message: `success save ${name}`, data: users };
});

export default userRouter;

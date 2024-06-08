import { type RequestEvent } from "@nhttp/nhttp";
import { type User } from "components/user_form.tsx";

export const users = [] as User[];

export default {
  POST: (rev: RequestEvent) => {
    users.push(rev.body as User);
    return { message: "success add user" };
  },
};

import { Controller, Get, Post, Status } from "nhttp/controller.ts";
import UserModel from "models/user_model.ts";
import { UserView } from "views/user_view.tsx";
import { RequestEvent } from "nhttp";

const users = [] as UserModel[];

@Controller("/user")
class UserController {
  @Get()
  index() {
    return <UserView title="User Page" users={users} />;
  }

  @Post()
  @Status(201)
  save(rev: RequestEvent) {
    const user = new UserModel();
    user.first_name = rev.body.first_name;
    user.last_name = rev.body.last_name;
    users.push(user);
    return <UserView title="User Page" users={users} />;
  }
}

export default UserController;

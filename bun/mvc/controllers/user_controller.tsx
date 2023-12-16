import { Controller, Get, Post, Status, Wares } from "nhttp-land/controller";
import { csrf } from "nhttp-land/csrf";
import UserModel from "models/user_model.ts";
import { UserView } from "views/user_view.tsx";
import { RequestEvent } from "nhttp-land";

const users = [] as UserModel[];
const csrfProtect = csrf({ cookie: true });

@Controller("/user")
class UserController {
  @Get()
  @Wares(csrfProtect)
  index(rev: RequestEvent) {
    return (
      <UserView
        csrf={rev.csrfToken()}
        title="User Page"
        users={users}
      />
    );
  }

  @Post()
  @Wares(csrfProtect)
  @Status(201)
  save(rev: RequestEvent) {
    const user = new UserModel();
    user.first_name = rev.body.first_name;
    user.last_name = rev.body.last_name;
    users.push(user);
    return (
      <UserView
        csrf={rev.csrfToken()}
        title="User Page"
        users={users}
      />
    );
  }
}

export default UserController;

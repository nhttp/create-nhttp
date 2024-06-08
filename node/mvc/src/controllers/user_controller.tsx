import {
  Controller,
  createDecorator,
  Get,
  Post,
  Status,
} from "@nhttp/nhttp/controller";
import { csrf } from "@nhttp/nhttp/csrf";
import UserModel from "models/user_model.js";
import { UserView } from "views/user_view.js";
import { RequestEvent } from "@nhttp/nhttp";

const users = [] as UserModel[];
const Csrf = () => createDecorator(csrf({ cookie: true }));

@Controller("/user")
class UserController {
  @Get()
  @Csrf()
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
  @Csrf()
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

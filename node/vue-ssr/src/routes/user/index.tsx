import { Helmet } from "@nhttp/nhttp/jsx";
import UserForm from "components/user_form.js";
import { users } from "../api/user/index.js";
import { type RequestEvent } from "@nhttp/nhttp";
import Layout from "components/layout.js";

export default function user(rev: RequestEvent) {
  return (
    <Layout>
      <Helmet>
        <title>Wellcome User</title>
      </Helmet>
      <div className="flex items-center flex-col justify-center text-slate-700 space-y-3">
        <div className="mt-10">
          <UserForm users={users} />
        </div>
      </div>
    </Layout>
  );
}

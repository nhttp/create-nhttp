import { Helmet } from "nhttp-land/jsx";
import UserForm from "components/user_form.tsx";
import { users } from "../api/user/index.ts";
import { type RequestEvent } from "nhttp-land";
import Layout from "components/layout.tsx";

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

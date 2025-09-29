import { Helmet } from "@nhttp/nhttp/jsx";
import { type RequestEvent } from "@nhttp/nhttp";
import Layout from "components/layout.js";

export default function userByName(rev: RequestEvent) {
  return (
    <Layout>
      <Helmet>
        <title>{`Wellcome ${rev.params.name}`}</title>
      </Helmet>
      <div className="flex items-center flex-col justify-center mt-40 text-slate-700 space-y-3">
        <h1 className="text-6xl">{rev.params.name}</h1>
        <p className="text-xl">
          Go Back <a href="/user" className="text-blue-800">/user</a>
        </p>
      </div>
    </Layout>
  );
}

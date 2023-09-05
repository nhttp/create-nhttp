import Counter from "components/counter.tsx";
import { Helmet } from "nhttp/jsx.ts";
import { type RequestEvent } from "nhttp";
import Layout from "components/layout.tsx";

export default function home(rev: RequestEvent) {
  return (
    <Layout>
      <Helmet>
        <title>Wellcome Home</title>
      </Helmet>
      <div className="flex items-center flex-col justify-center mt-40 text-slate-700 space-y-3">
        <h1 className="text-6xl">Welcome Home</h1>
        <p className="text-xl">This is a basic Home Page</p>
        <p className="text-xl">
          Go to url <a href="/user" className="text-blue-800">/user</a>
        </p>
        <h1 className="text-2xl mt-2">Counter</h1>
        <Counter />
      </div>
    </Layout>
  );
}

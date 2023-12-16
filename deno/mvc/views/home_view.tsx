import { FC, Helmet } from "nhttp/jsx.ts";
import Layout from "components/layout.tsx";

export const HomeView: FC<{ title: string }> = (props) => {
  return (
    <Layout>
      <Helmet>
        <title>{props.title}</title>
      </Helmet>
      <div className="flex items-center flex-col justify-center mt-40 text-slate-700 space-y-3">
        <h1 className="text-6xl">Welcome Home</h1>
        <p className="text-xl">This is a basic Home Page</p>
        <p className="text-xl">
          Go to url <a href="/user" className="text-blue-800">/user</a>
        </p>
      </div>
    </Layout>
  );
};

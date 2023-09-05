import { FC, Helmet } from "nhttp-land/jsx";

export const HomeView: FC<{ title: string }> = (props) => {
  return (
    <>
      <Helmet>
        <title>{props.title}</title>
      </Helmet>
      <div class="flex items-center flex-col justify-center mt-40 text-slate-700 space-y-3">
        <h1 class="text-6xl">Welcome Home</h1>
        <p class="text-xl">This is a basic Home Page</p>
        <p class="text-xl">
          Go to url <a href="/user" class="text-blue-800">/user</a>
        </p>
      </div>
    </>
  );
};

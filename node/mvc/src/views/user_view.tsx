import { FC, Helmet, useScript } from "@nhttp/nhttp/jsx";
import UserModel from "models/user_model.js";
import Layout from "components/layout.js";

type FCUser = { title: string; users: UserModel[]; csrf: string };

export const UserView: FC<FCUser> = (props) => {
  useScript(() => {
    document.getElementById("first_name")?.focus();
  });
  return (
    <Layout>
      <Helmet>
        <title>{props.title}</title>
      </Helmet>
      <div className="flex items-center flex-col justify-center text-slate-700 space-y-3">
        <div className="mt-10">
          <h1 className="text-4xl mb-10">Data User</h1>
          <form
            method="POST"
            action="/user"
            enctype="multipart/form-data"
          >
            <input type="hidden" name="_csrf" value={props.csrf} />
            <div className="flex flex-wrap -m-2">
              <div className="p-2 w-5/12">
                <div className="relative">
                  <label
                    for="first_name"
                    className="leading-7 text-sm text-gray-600"
                  >
                    First Name
                  </label>
                  <input
                    id="first_name"
                    name="first_name"
                    type="text"
                    placeholder="First Name"
                    autocomplete="off"
                    className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                    required
                  />
                </div>
              </div>
              <div className="p-2 w-5/12">
                <div className="relative">
                  <label
                    for="last_name"
                    className="leading-7 text-sm text-gray-600"
                  >
                    Last Name
                  </label>
                  <input
                    id="last_name"
                    name="last_name"
                    type="text"
                    placeholder="Last Name"
                    autocomplete="off"
                    className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                    required
                  />
                </div>
              </div>
              <div className="p-2 w-2/12 mt-7">
                <button
                  type="submit"
                  className="flex mx-auto text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
                >
                  Save
                </button>
              </div>
            </div>
          </form>
          <div className="mt-10">
            {props.users.map((user) => {
              return <li>{user.first_name} {user.last_name}</li>;
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
};

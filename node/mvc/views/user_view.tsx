import { FC, Helmet } from "nhttp-land/jsx";
import UserModel from "models/user_model.ts";
import Layout from "components/layout.tsx";

export const UserView: FC<{ title: string; users: UserModel[] }> = (props) => {
  return (
    <Layout>
      <Helmet>
        <title>{props.title}</title>
      </Helmet>
      <Helmet footer>
        {/* inject client-script example */}
        <script>{`document.getElementById("first_name").focus();`}</script>
      </Helmet>
      <div class="flex items-center flex-col justify-center text-slate-700 space-y-3">
        <div class="mt-10">
          <h1 class="text-4xl mb-10">Data User</h1>
          <form
            method="POST"
            action="/user"
            enctype="multipart/form-data"
          >
            <div class="flex flex-wrap -m-2">
              <div class="p-2 w-5/12">
                <div class="relative">
                  <label
                    for="first_name"
                    class="leading-7 text-sm text-gray-600"
                  >
                    First Name
                  </label>
                  <input
                    id="first_name"
                    name="first_name"
                    type="text"
                    placeholder="First Name"
                    autocomplete="off"
                    class="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                    required
                  />
                </div>
              </div>
              <div class="p-2 w-5/12">
                <div class="relative">
                  <label
                    for="last_name"
                    class="leading-7 text-sm text-gray-600"
                  >
                    Last Name
                  </label>
                  <input
                    id="last_name"
                    name="last_name"
                    type="text"
                    placeholder="Last Name"
                    autocomplete="off"
                    class="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                    required
                  />
                </div>
              </div>
              <div class="p-2 w-2/12 mt-7">
                <button
                  type="submit"
                  class="flex mx-auto text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
                >
                  Save
                </button>
              </div>
            </div>
          </form>
          <div class="mt-10">
            {props.users.map((user) => {
              return <li>{user.first_name} {user.last_name}</li>;
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
};

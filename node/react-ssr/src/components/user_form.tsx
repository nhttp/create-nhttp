import { type FC, useEffect, useRef, useState } from "react";
import { withHydrate } from "@nhttp/hydrate";

export type User = {
  first_name: string;
  last_name: string;
};

const UserForm: FC<{ users: User[] }> = (props) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [users, setUsers] = useState(props.users);
  const firstNameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    firstNameRef.current?.focus();
  }, [users]);

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const user = {
      first_name: firstName,
      last_name: lastName,
    } as User;
    await fetch("./api/user", {
      method: "POST",
      body: JSON.stringify(user),
    });
    setUsers(users.concat(user));
    setFirstName("");
    setLastName("");
  };
  return (
    <>
      <h1 className="text-4xl mb-10">Data User</h1>
      <form onSubmit={onSubmit}>
        <div className="flex flex-wrap -m-2">
          <div className="p-2 w-5/12">
            <div className="relative">
              <label className="leading-7 text-sm text-gray-600">
                First Name
              </label>
              <input
                ref={firstNameRef}
                onChange={(e) => setFirstName(e.target.value)}
                value={firstName}
                type="text"
                placeholder="First Name"
                autoComplete="off"
                className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                required
              />
            </div>
          </div>
          <div className="p-2 w-5/12">
            <div className="relative">
              <label className="leading-7 text-sm text-gray-600">
                Last Name
              </label>
              <input
                onChange={(e) => setLastName(e.target.value)}
                value={lastName}
                type="text"
                placeholder="Last Name"
                autoComplete="off"
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
        {users.map((user, i) => {
          const fullname = user.first_name + " " + user.last_name;
          return (
            <li className="mt-5" key={i}>
              <a
                className="text-white bg-gray-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
                href={`/user/${fullname}`}
              >
                {fullname}
              </a>
            </li>
          );
        })}
      </div>
    </>
  );
};

// HOC client-interactive
export default withHydrate(UserForm, import.meta.url);

import { createProject } from "./create.js";

const isDeno = typeof Deno !== "undefined";

createProject(
  isDeno ? Deno.args : process.argv,
  isDeno ? Deno.cwd() : process.cwd(),
  isDeno ? void 0 : process.env.npm_config_user_agent,
)
  .catch(console.error);

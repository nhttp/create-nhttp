import { createProject } from "./create.js";

const isDeno = typeof Deno !== "undefined";

createProject(
  isDeno ? Deno.args : process.argv,
  isDeno ? Deno.cwd() : process.cwd(),
)
  .catch(console.error);

// Credit : https://github.com/vitejs/vite/tree/main/packages/create-vite

import fs from "node:fs";
import path from "node:path";
import { green, red, reset, yellow } from "kolorist";
import { fileURLToPath } from "node:url";
import minimist from "minimist";
import prompts from "prompts";
import denoTemplate from "./templates/deno.js";
import nodeTemplate from "./templates/node.js";
import bunTemplate from "./templates/bun.js";

const RUNTIME_LIST = [
  {
    name: "deno",
    display: "Deno",
    templates: denoTemplate,
  },
  {
    name: "node",
    display: "Node",
    templates: nodeTemplate,
  },
  {
    name: "bun",
    display: "Bun",
    templates: bunTemplate,
  },
];

const RUNTIMES = RUNTIME_LIST.map(
  (f) => (f.templates && f.templates.map((v) => v.name)) || [f.name],
).reduce((a, b) => a.concat(b), []);

const renameFiles = {
  _gitignore: ".gitignore",
};

const defaultTargetDir = "nhttp-project";

async function getLatestVersion() {
  try {
    const res = await fetch("https://apiland.deno.dev/v2/modules/nhttp");
    const json = await res.json();
    return json.latest_version;
  } catch (err) {
    console.error(err);
    return null;
  }
}

function formatTargetDir(targetDir) {
  return targetDir?.trim().replace(/\/+$/g, "");
}

function copy(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    copyDir(src, dest);
  } else {
    fs.copyFileSync(src, dest);
  }
}

function copyDir(srcDir, destDir) {
  fs.mkdirSync(destDir, { recursive: true });
  for (const file of fs.readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file);
    const destFile = path.resolve(destDir, file);
    copy(srcFile, destFile);
  }
}

function isEmpty(path) {
  const files = fs.readdirSync(path);
  return files.length === 0 || (files.length === 1 && files[0] === ".git");
}

function emptyDir(dir) {
  if (!fs.existsSync(dir)) {
    return;
  }
  for (const file of fs.readdirSync(dir)) {
    if (file === ".git") {
      continue;
    }
    fs.rmSync(path.resolve(dir, file), { recursive: true, force: true });
  }
}

function genPackageName(runtime) {
  if (runtime === "deno") return ["deno.json", "import_map.json"];
  return ["package.json"];
}

function editFile(file, callback) {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, "utf-8");
    fs.writeFileSync(file, callback(content), "utf-8");
  }
}

export async function createProject(param, cwd, env) {
  const argv = minimist(param.slice(2), { string: ["_"] });
  const argTargetDir = formatTargetDir(argv._[0]);
  const argTemplate = argv.template || argv.t;
  let targetDir = argTargetDir || defaultTargetDir;
  let result;
  try {
    result = await prompts(
      [
        {
          type: argTargetDir ? null : "text",
          name: "projectName",
          message: reset("Project name:"),
          initial: defaultTargetDir,
          onState: (state) => {
            targetDir = formatTargetDir(state.value) || defaultTargetDir;
          },
        },
        {
          type: () =>
            !fs.existsSync(targetDir) || isEmpty(targetDir) ? null : "confirm",
          name: "overwrite",
          message: () =>
            (targetDir === "."
              ? "Current directory"
              : `Target directory "${targetDir}"`) +
            ` is not empty. Remove existing files and continue?`,
        },
        {
          type: (_, { overwrite }) => {
            if (overwrite === false) {
              throw new Error(red("✖") + " Operation cancelled");
            }
            return null;
          },
          name: "overwriteChecker",
        },
        {
          type: argTemplate && RUNTIMES.includes(argTemplate) ? null : "select",
          name: "runtime",
          message:
            typeof argTemplate === "string" && !RUNTIMES.includes(argTemplate)
              ? reset(
                `"${argTemplate}" isn't a valid template. Please choose from below: `,
              )
              : reset("Select a runtime:"),
          initial: 0,
          choices: RUNTIME_LIST.map((runtime) => {
            return {
              title: yellow(runtime.display || runtime.name),
              value: runtime,
            };
          }),
        },
        {
          type: (runtime) => runtime && runtime.templates ? "select" : null,
          name: "variant",
          message: reset("Select a template:"),
          choices: (runtime) =>
            runtime.templates.map((variant) => {
              return {
                title: green(variant.display || variant.name),
                value: variant.name,
              };
            }),
        },
      ],
      {
        onCancel: () => {
          throw new Error(red("✖") + " Operation cancelled");
        },
      },
    );
  } catch (cancelled) {
    console.log(cancelled.message);
    return;
  }

  // user choice associated with prompts
  const { runtime, overwrite, variant } = result;
  const root = path.join(cwd, targetDir);
  if (overwrite) {
    emptyDir(root);
  } else if (!fs.existsSync(root)) {
    fs.mkdirSync(root, { recursive: true });
  }
  // determine template
  let template = variant || runtime?.name || argTemplate;
  console.log(`\nScaffolding project in ${root}...`);
  const runtimeName = runtime?.name ?? "deno";
  const templateDir = path.resolve(
    fileURLToPath(import.meta.url),
    "../..",
    `${runtimeName}/${template}`,
  );
  const write = (file, content) => {
    const targetPath = path.join(root, renameFiles[file] ?? file);
    if (content) {
      fs.writeFileSync(targetPath, content);
    } else {
      copy(path.join(templateDir, file), targetPath);
    }
  };
  let note = "";
  const files = fs.readdirSync(templateDir);
  for (const file of files) {
    write(file);
  }
  const targetPath = path.join(root, "note.txt");
  if (fs.existsSync(targetPath)) {
    note = fs.readFileSync(targetPath, { encoding: "utf8", flag: "r" });
  }
  const version = await getLatestVersion();
  if (version === null) {
    throw new Error("failure to fetch get latest version");
  }
  const pNames = genPackageName(runtimeName);
  pNames.forEach((name) => {
    editFile(path.resolve(root, name), (content) => {
      return content.replace(
        /\<VERSION\>/g,
        version,
      );
    });
  });
  const cdProjectName = path.relative(cwd, root);
  if (root !== cwd) {
    console.log(
      `  cd ${
        cdProjectName.includes(" ") ? `"${cdProjectName}"` : cdProjectName
      }`,
    );
  }
  console.log();
  console.log(note);
  console.log();
}

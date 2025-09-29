import fs from "node:fs";
try {
  fs.writeFileSync("_core/router.ts", "export default void 0;", {
    encoding: "utf-8",
  });
  fs.rmSync("build", { recursive: true });
} catch { /* noop */ }

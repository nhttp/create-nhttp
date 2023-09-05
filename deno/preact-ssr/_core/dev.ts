try {
  await Deno.writeTextFile("_core/router.ts", "export default void 0;");
  await Deno.remove("build", { recursive: true });
} catch { /* noop */ }

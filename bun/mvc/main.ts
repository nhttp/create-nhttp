import Application from "./app.tsx";

const app = new Application();

app.listen(8000, (err, info) => {
  if (err) throw err;
  console.log(`> Running on port ${info.port}`);
});

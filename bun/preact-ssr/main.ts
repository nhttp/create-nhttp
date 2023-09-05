import app from "./app.ts";

app.listen(8000, (err, info) => {
  if (err) throw err;
  console.log(`> Running on port ${info.port}`);
});

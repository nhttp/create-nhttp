import app from "./_core/ssr.js";

app.listen(8000, (err, info) => {
  if (err) throw err;
  console.log(`> Running on port ${info.port}`);
});

const express = require("express");
const next = require("next");
const bodyParser = require("body-parser");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Increase payload limit to 5MB
  server.use(bodyParser.json({ limit: "5mb" }));
  server.use(bodyParser.urlencoded({ limit: "5mb", extended: true }));

  server.all("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(3001, (err) => {
    if (err) throw err;
    console.log("> Ready on http://localhost:3001");
  });
});

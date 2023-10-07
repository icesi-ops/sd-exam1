const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Hola mundo");
});

app.post("/files", (req, res) => {
    res.send("Hola mundo");
  });

app.listen(8001, (req, res) => {
  console.log("Server Started");
});

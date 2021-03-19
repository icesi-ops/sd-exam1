import express from "express";
import { json } from "body-parser";
import { apiRouter } from "./api";

import * as env from "env-var";
import * as path from "path";

import mongoose from "mongoose";

const { HOST, LB } = process.env;

const app = express();
app.use(json());
app.use(apiRouter);

console.log(path.join(__dirname, "build"));
console.log({ HOST, LB });

app.set("views", path.join(__dirname, "build"));
app.engine("html", require("ejs").renderFile);
app.use('/static',
express.static(path.join(__dirname, "build/static")));

app.get("/", function (_req, res) {
  res.render("index.html", { HOST, LB });
});

const db_ip: string = env.get("DB_IP").required().asString();

mongoose.connect(
  "mongodb://" + db_ip + ":27017/files",
  {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("connected to db");
  }
);

app.listen(3000, () => {
  console.log("server is listening on port 3000");
});

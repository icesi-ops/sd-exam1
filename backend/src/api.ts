import express from "express";
import { Request, Response } from "express";
import { File } from "../src/models/file";

import Busboy from "busboy";
import * as path from "path";
import * as fs from "fs";
import * as env from "env-var";

const df = require("node-df");
const util = require("util");
const real_df = util.promisify(df);

const storage: string = env.get("STORAGE").required().asString();

const router = express.Router();

router.get("/api/files", async (_req: Request, res: Response) => {
  return res.send(
    (await File.find({})).map((item) => {
      return {
        id: item._id,
        name: item.name,
        path: item.path,
        type: item.type,
      };
    })
  );
});

router.post("/api/upload", async (req: Request, res: Response) => {
  const busboy = new Busboy({ headers: req.headers });

  busboy.on(
    "file",
    async (_fieldname, file, filename, _encoding, _mimetype) => {
      const fl = File.build({
        name: filename,
        path: path.join(storage, filename),
        type: filename.split(".").pop() || "",
      });
      // path to file upload
      const saveTo = path.join(storage, filename);
      file.pipe(fs.createWriteStream(saveTo));
      const docs = await File.find({ name: filename });
      if (docs.length == 0) {
        await fl.save();
      }
    }
  );

  busboy.on("finish", function () {
    res.status(200).json({ message: "File uploaded successfully." });
  });
  req.pipe(busboy);
});

router.get("/api/availableStorage", async (_req: Request, res: Response) => {
  try {
    const result: [any] = await real_df();
    const df = result.filter((item) => item.mount === "/mnt/shared")[0];
    return res.status(200).send(JSON.stringify(df.available));
  } catch (error) {
    console.log(error);
  }
});

export { router as apiRouter };

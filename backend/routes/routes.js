const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const fileController = require("../controller/file.controller");
const dbController = require("../controller/db.controller");

let routes = (app) => {
    router.post("/upload", upload, fileController.upload);
    router.get("/files", fileController.getListFiles);
    router.get("/files/:name", fileController.download);
    router.delete("/files/:id/:rev", fileController.removeFile);
    router.put("/files", fileController.updateFile);
    router.get("/db", dbController.listDbs);
    router.post("/db/:db", dbController.createDb);
    router.get("/health", (req, res) => {
        res.status(200).send("OK");
    });

    app.use(router);
};

module.exports = routes;
const express = require("express");
const router = express.Router();
const controller = require("../controller/file.controller");

let routes = (app) => {
    router.post("/upload", controller.upload);
    router.get("/files", controller.getListFiles);
    router.get("/files/:name", controller.download);
    router.get("/health", (req, res) => {
        res.status(200).send("OK");
    });

    app.use(router);
};

module.exports = routes;
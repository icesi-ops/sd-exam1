const util = require("util");
const multer = require("multer");
const sendFile = require("./samba");

const maxSize = 2 * 1024 * 1024;

const directoryPath = __basedir + "/resources/static/assets/uploads/";

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __basedir + "/resources/static/assets/uploads/");
    },
    filename: (req, file, cb) => {
        console.log(file.originalname);
        cb(null, file.originalname);
        sendFile(directoryPath + file.originalname, file.originalname)
            .then(r => console.log(r))
            .catch(e => console.log(e));
    },
});

let uploadFile = multer({
    storage: storage,
    limits: { fileSize: maxSize },
}).single("file");

let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;
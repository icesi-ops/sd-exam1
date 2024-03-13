const samba = require("../middleware/samba");
const couchdb = require("../middleware/couchdb");
const fs = require("fs");

const backendName = process.env.BACKEND_NAME; // app-backend
const backendPort = process.env.BACKEND_PORT || 3000; // 3000
const baseUrl = `http://${backendName}:${backendPort}/files/`;
const directoryPath = __basedir + '/resources/static/assets/uploads/';

const upload = async (req, res) => {
    try {
        const file = req.file;

        if (file === undefined) {
            return res.status(400).send({ message: "Please upload a file!" });
        }

        const dbName = 'files';
        await couchdb.insertDocument(dbName, file);
        await samba.sendFile(directoryPath + file.originalname, file.originalname);

        res.status(200).send({
            message: "Uploaded the file successfully: " + file.originalname,
        });

        fs.rm(directoryPath + file.originalname, (err) => {
            if (err) {
                console.error(err);
                return;
            }

            console.log('File removed');
        })
    } catch (err) {

        if (err.code === 'ECONNREFUSED') {
            res.status(500).send({
                message: `Could not upload the file: ${req.file.originalname}. CouchDB is not reachable`,
            });
        }

        if (err.code === 'LIMIT_FILE_SIZE') {
            res.status(500).send({
                message: `Could not upload the file: ${req.file.originalname}. File size exceeds limit`,
            });
        }

        res.status(500).send({
            message: `Could not upload the file: ${req.file.originalname}. ${err}`,
        });
    }
};

const getListFiles = (req, res) => {

    const dbName = 'files';

    couchdb.listDocuments(dbName).then((docs) => {
        console.log(docs)
        res.status(200).send(docs);
    }).catch(
        (err) => {
            if (err) {
                res.status(500).send({
                    message: "Unable to reach files!",
                });
            }
        }
    )
};

const download = async (req, res) => {
    const fileName = req.params.name;

    await samba.getFile(fileName, directoryPath + fileName);

    res.download(directoryPath + fileName, fileName, (err) => {
        if (err) {
            res.status(500).send({
                message: "Could not download the file. " + err,
            });
        }
    });
};

const removeFile = (req, res) => {
    const fileId = req.params.id;
    const fileRev = req.params.rev;

    const dbName = 'files';

    couchdb.removeDocument(dbName, fileId, fileRev).then(() => {
        res.status(200).send({
            message: "File removed successfully",
        });
    }).catch(
        (err) => {
            if (err) {
                res.status(500).send({
                    message: "Unable to remove file!",
                });
            }
        }
    )
}

const updateFile = (req, res) => {
    const dbName = 'files';
    console.log(req.body);
    couchdb.updateDocument(dbName, req.body).then(() => {
        res.status(200).send({
            message: "File updated successfully",
        });
    }).catch(
        (err) => {
            if (err) {
                res.status(500).send({
                    message: "Unable to update file!",
                });
            }
        }
    )
}

module.exports = {
    upload,
    getListFiles,
    download,
    removeFile,
    updateFile
};
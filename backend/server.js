const express = require("express");
const fileUpload = require("express-fileupload");
const path = require("path");
const SMB2 = require("smb2");

const filesPayloadExists = require("./middleware/filesPayloadExists");
const fileExtLimiter = require("./middleware/fileExtLimiter");
const fileSizeLimiter = require("./middleware/fileSizeLimiter");

const PORT = process.env.PORT || 3500;
const app = express();

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
  // res.send("Hola mundo");
});

const smb2Client = new SMB2({
  share: "\\\\samba\\Compartido",
  domain: "WORKGROUP",
  username: "root",
  password: "",
});

app.post(
  "/upload",
  fileUpload({ createParentPath: true }),
  filesPayloadExists,
  // fileExtLimiter([".png", ".jpg", ".jpeg"]),
  fileExtLimiter([".pdf"]),
  fileSizeLimiter,
  (req, res) => {
    const files = req.files;

    Object.keys(files).forEach((key) => {
      const filepath = path.join(__dirname, "files", files[key].name);
      smb2Client.writeFile(filepath, files[key].data, function (err) {
        if (err) return res.status(500).json({ status: "error", message: err });
      });
      // files[key].mv(filepath, (err) => {
      //   if (err) return res.status(500).json({ status: "error", message: err });
      // });
    });

    return res.json({
      status: "success",
      message: Object.keys(files).toString(),
    });
  }
);

// app.post("/files", (req, res) => {
//   res.send("Hola mundo");
// });

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

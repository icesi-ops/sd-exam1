const express = require("express");
const fileUpload = require("express-fileupload");
const path = require("path");
const cors = require("cors");
const fs = require("fs");

const filesPayloadExists = require("./middleware/filesPayloadExists");
const fileExtLimiter = require("./middleware/fileExtLimiter");
const fileSizeLimiter = require("./middleware/fileSizeLimiter");

const PORT = process.env.PORT || 3500;
const app = express();

app.use(cors());

app.post(
  "/upload",
  fileUpload({ createParentPath: true }),
  filesPayloadExists,
  fileExtLimiter([".pdf"]),
  fileSizeLimiter,
  (req, res) => {
    const files = req.files;
    console.log(files);

    Object.keys(files).forEach((key) => {
      const filepath = path.join(__dirname, "files", files[key].name);
      files[key].mv(filepath, (err) => {
        if (err) return res.status(500).json({ status: "fail", message: err });
      });
    });

    // return res.status(200).json({ status: 'success', message: Object.keys(files).toString() })
    return res.status(200).json({ status: "success" });
  }
);

// Endpoint para obtener la lista de archivos
app.get("/files", (req, res) => {
  const filesDir = path.join(__dirname, "files");

  // Lee el contenido del directorio
  fs.readdir(filesDir, (err, files) => {
    if (err) {
      return res.status(500).json({ status: "fail", message: err });
    }

    // Filtra solo los archivos con extensión .pdf
    const pdfFiles = files.filter((file) => path.extname(file) === ".pdf");

    return res.status(200).json({ status: "success", files: pdfFiles });
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

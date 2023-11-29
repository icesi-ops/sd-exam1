const express = require("express");
const fileUpload = require("express-fileupload");
const path = require("path");
const cors = require("cors");
const fs = require("fs");
const util = require("util");

const filesPayloadExists = require("./middleware/filesPayloadExists");
const fileExtLimiter = require("./middleware/fileExtLimiter");
const fileSizeLimiter = require("./middleware/fileSizeLimiter");

const PORT = process.env.PORT || 3500;
const app = express();

app.use(cors());


// Función de utilidad para ejecutar comandos en el sistema
const exec = util.promisify(require("child_process").exec);

app.post(
  "/upload",
  fileUpload({ createParentPath: true }),
  filesPayloadExists,
  fileExtLimiter([".pdf"]),
  fileSizeLimiter,
  async (req, res) => {
    const files = req.files;
    console.log(files);

    try {
      Object.keys(files).forEach(async (key) => {
        // Obtiene el nombre del archivo
        const buffer = files[key].data;
        // Crea un archivo temporal con el buffer
        const tmpDir = path.join(__dirname, "tmp");
        if (!fs.existsSync(tmpDir)) {
          fs.mkdirSync(tmpDir);
        }
        const tmpFile = path.join(tmpDir, files[key].name);
        await fs.writeFileSync(tmpFile, buffer);

        // Construye la línea de comando para smbclient
        const smbCommand = `smbclient -U admin -c 'put "/app/tmp/""${files[key].name}" "${files[key].name}"' //samba/sambashare --password password`;

        // Ejecuta el comando smbclient
        const { stdout, stderr } = await exec(smbCommand);

        // Log de salida estándar y error (puedes ajustar esto según tus necesidades)
        console.log("Smbclient stdout:", stdout);
        console.error("Smbclient stderr:", stderr);

        // Borra el archivo temporal
        fs.unlinkSync(tmpFile);
      });
      return res.status(200).json({ status: "success" });
    } catch (err) {
      return res.status(500).json({ status: "fail", message: err });
    }
  }
);

app.get("/files", async (req, res) => {
  try {
    // Construye la línea de comando para smbclient
    const smbCommand = `smbclient //samba/sambashare -U admin --password password -c 'ls' | awk '{print $1}'`;

    // Ejecuta el comando smbclient
    const { fileList, stderr }   = await execCommand(smbCommand);

    console.log("Smbclient stdout:", fileList);
    console.error("Smbclient stderr:", stderr);
    // Procesa la salida para obtener los nombres de archivo


    return res.status(200).json({ status: "success", files: fileList });
  } catch (err) {
    return res.status(500).json({ status: "fail", message: err });
  }
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

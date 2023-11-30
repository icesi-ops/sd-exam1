const express = require("express");
const cors = require("cors");
const fs = require("fs");
const bodyParser = require('body-parser')
const SambaClient = require('samba-client');

let client = new SambaClient({
  address: '//samba/storage', // required
});

console.log("SAMBA CLIENT:", client);



SAVE_DIR = "/tmp"; 
const jsonParser = bodyParser.json({limit: "100mb"})
const urlencodedParser = bodyParser.urlencoded({ extended: false })

const app = express();
app.use(cors());

app.use(jsonParser);
app.use(urlencodedParser);


const PORT = '5000' || process.env.PORT;

async function send_file_samba(src, dst) {
  console.log("Sending file to sambda.. from ", src, " to ", dst);
  var res = await client.sendFile(src, dst);
  console.log("Done");
  console.log(res);
}

async function save_file(data, dst){
    await fs.writeFile(dst, data, (err) => {
      if (err) {
          console.log("Error: ", err);
          res.status(500).send(err);
      } else {
          console.log("File saved temporarily at ", dst);
      }
    }
  )
} 

app.post("/api/upload", (req, res) => {
    console.log("Received request: ");
    const save_path = SAVE_DIR + "/" + req.body.filename
    console.log("Saving encoded file", req.body.filename," in temporal directory ", save_path);
    save_file(req.body.data, save_path);
    send_file_samba(save_path, req.body.filename);
    res.json({filepath: save_path});
});

app.listen(PORT, () => console.log("Server listening on port " + PORT));

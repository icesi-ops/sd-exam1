const cors = require("cors");
const express = require("express");
const app = express();

global.__basedir = __dirname;

var corsOptions = {
    origin: "http://localhost:4200"
};

app.use(cors(corsOptions));

const initRoutes = require("./routes/routes");

app.use(express.urlencoded({ extended: true }));
initRoutes(app);

let port = 3000;
app.listen(port, () => {
    console.log(`Running at localhost:${port}`);
});
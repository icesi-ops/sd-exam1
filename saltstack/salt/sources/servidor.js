var express = require("express");
var app = express();
var port = 8080;

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


var mongoose = require("mongoose");
/*
mongoose.Promise = global.Promise;mongoose.connect("mongodb://localhost:27017/node-demo");
*/

var promise = mongoose.connect('mongodb://192.168.130.20:8080/node-demo', {
  useMongoClient: true,
  /* other options */
});


var nameSchema = new mongoose.Schema({
 firstName: String,
 lastName: String
});

var User = mongoose.model("User", nameSchema);

app.get("/", (req, res) => {
 res.sendFile(__dirname + "/index.html");
});



app.post("/addname", (req, res) => {
 var myData = new User(req.body);
 myData.save()
 .then(item => {
 res.send("item saved to database");
 })
 .catch(err => {
 res.status(400).send("unable to save to database");
 });
});



app.listen(port, () => {
 console.log("Server listening on port " + port);
});

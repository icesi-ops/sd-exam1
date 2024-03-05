const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const NodeCouchDb = require('node-couchdb');
const cors = require('cors');

const DATABASE_NAME = 'files'; // replace with env variable

const couch = new NodeCouchDb({
    auth: {
        user: 'alex',      // replace with env variable
        password: 'alex'   // replace with env variable
    }
});

couch.listDatabases().then((dbs) => {
    console.log(dbs);
}, err => {
    console.log(err);
});

const app = express();

const corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.send('GET /');
});

app.post('/files', (req, res) => {
    console.log('POST /files ', req.body);
    res.send('POST /files' + req.body);
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});
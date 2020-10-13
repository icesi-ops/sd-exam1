const http = require('http');
const express = require('express');
const path = require('path');

const app = express();
const port = 5000;

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname + '/webserver/')));

//Routes
app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname + '/webserver/index.html'));
    });

app.post('/submit-data', (req, res) => {
        res.send('POST Request');
    });
    
app.put('/update-data', (req, res) => {
        res.send('PUT Request');
    });
    
app.delete('/delete-data', (req, res) => {
        res.send('DELETE Request');
    });

const server = app.listen(port, () => {
        console.log(`Node server is running on port ${port}`);
    });
const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname + '/webserver/')));

//Connect to DB
mongoose.connect('mongodb://192.168.224.13:27017/BooksDB', { useNewUrlParser: true }, (err) => {
    if(!err) {
        console.log('MongoDB Connection Succeeded.');
    } else {
        console.log('Error in DB connection : ' + err);
    }
});

//MongoDB attributes
const bookSchema = new mongoose.Schema({
    Title: { type: String, required: 'This field is required' },
    Author: { type: String, required: 'This field is required' },
    Genre: { type: String, required: 'This field is required' }
});
mongoose.model('Book', bookSchema);
const Book = mongoose.model('Book');

//Routes
app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname + '/webserver/index.html'));
    });

app.get('/add', (req, res) => {
        res.sendFile(path.join(__dirname + '/webserver/add_book_form.html'));
    });

app.get('/data', (req, res) => {
    Book.find((err, docs) => {
            if(!err){
                res.json(docs);
            }else{
                console.log('Error in retrieving book list: ' + err);
            }
        });
        
    });

app.post('/add', (req, res) => {
        console.log(req.body);
        insertRecord(req, res);
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

//Modify MongoDB
function insertRecord(req, res){
    let book = new Book();
    book.Title = req.body.Title;
    book.Author = req.body.Author;
    book.Genre = req.body.Genre;
    book.save((err, doc)=>{
        if(!err){
            res.redirect('/');
        }else{
            console.log('Error during record insertion: ' + err);
            res.send('Error')
        }
    });
}
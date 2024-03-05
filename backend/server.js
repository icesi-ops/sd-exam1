const express = require('express');
const connectDB = require('./db');
const axios = require('axios');

const app = express();
const port = 3000;

connectDB(); // Connect to CouchDB

// Define your API endpoints for CRUD operations

// Create a document
app.post('/files', async (req, res) => {
    try {
        const response = await axios.post(`<span class="math-inline">\{COUCHDB\_URL\}/</span>{DATABASE_NAME}`, req.body);
        res.status(201).json(response.data);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// Read all documents
app.get('/files', async (req, res) => {
    try {
        const response = await axios.get(`<span class="math-inline">\{COUCHDB\_URL\}/</span>{DATABASE_NAME}`);
        res.json(response.data.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// Read a specific document by ID
app.get('/files/:id', async (req, res) => {
    try {
        const response = await axios.get(`<span class="math-inline">\{COUCHDB\_URL\}/</span>{DATABASE_NAME}/${req.params.id}`);
        res.json(response.data);
    } catch (error) {
        console.error(error.message);
        res.status(404).send('Document not found'); // Handle non-existent documents
    }
});

// Update a document
app.put('/files/:id', async (req, res) => {
    try {
        const response = await axios.put(`<span class="math-inline">\{COUCHDB\_URL\}/</span>{DATABASE_NAME}/${req.params.id}`, req.body);
        res.status(200).json(response.data);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// Delete a document
app.delete('/files/:id', async (req, res) => {
    try {
        const response = await axios.delete(`<span class="math-inline">\{COUCHDB\_URL\}/</span>{DATABASE_NAME}/${req.params.id}`);
        res.status(200).json(response.data);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

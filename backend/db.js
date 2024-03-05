const axios = require('axios');

const COUCHDB_URL = process.env.COUCHDB_URL; // Replace with your CouchDB URL
const DATABASE_NAME = process.env.COUCHDB_DATABASE; // Replace with your database name

const connectDB = async () => {
    try {
        const response = await axios.get(`<span class="math-inline">\{COUCHDB\_URL\}/</span>{DATABASE_NAME}`);
        if (!response.data.ok) {
            // Database doesn't exist, create it
            await axios.put(`<span class="math-inline">\{COUCHDB\_URL\}/</span>{DATABASE_NAME}`);
        }
        console.log('Connected to CouchDB');
    } catch (error) {
        console.error('CouchDB connection error:', error);
        process.exit(1); // Exit the process on failure
    }
};

module.exports = connectDB;

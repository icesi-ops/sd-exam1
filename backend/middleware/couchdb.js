const NodeCouchDb = require('node-couchdb');

const AUTH_USER = process.env.COUCHDB_USER;
const AUTH_PASS = process.env.COUCHDB_PASS;

const BACKEND_NAME = process.env.BACKEND_NAME;
const BACKEND_PORT = process.env.BACKEND_PORT || 3000;
const BACKEND_URL = `http://localhost:${BACKEND_PORT}`;

const couch = new NodeCouchDb({
    host: 'app-couchdb',
    protocol: 'http',
    port: 5984,
    auth: {
        user: AUTH_USER,
        pass: AUTH_PASS
    }
});

const listDatabases = async () => {
    try {
        const dbs = await couch.listDatabases();
        console.log(dbs);
    } catch (err) {
        console.error(err);
    }
}

const createDatabase = async (dbName) => {
    try {
        const db = await couch.createDatabase(dbName);
    } catch (err) {
        console.error(err);
    }
}

const deleteDatabase = async (dbName) => {
    try {
        const db = await couch.deleteDatabase(dbName);
    } catch (err) {
        console.error(err);
    }
}

const listDocuments = async (dbName) => {
    try {
        const response = await couch.get(dbName, '_all_docs', { include_docs: true });
        const docs = response.data.rows.map(row => row.doc);
        return docs;
    } catch (err) {
        console.error(err);
    }
}

const insertDocument = async (dbName, file) => {
    try {
        const ids = await genUUID();
        file._id = ids[0];
        file.url = `${BACKEND_URL}/${dbName}/${file.originalname}`;
        couch.insert(dbName, file);
    } catch (err) {
        console.error(err);
    }
}

const removeDocument = async (dbName, id, rev) => {
    try {
        await couch.del(dbName, id, rev);
    } catch (err) {
        console.error(err);
    }
}

const updateDocument = async (dbName, file) => {
    try {
        await couch.update(dbName, file);
    } catch (err) {
        console.error(err);
        throw err;
    }

}

const genUUID = async () => {
    return await couch.uniqid();
}

module.exports = {
    listDatabases,
    createDatabase,
    deleteDatabase,
    insertDocument,
    listDocuments,
    removeDocument,
    updateDocument
}
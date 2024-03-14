const util = require('util');
const SambaClient = require('samba-client');

let client = new SambaClient({
    address: '//samba/shares', // required
    username: 'username', // not required, defaults to guest
    password: 'password', // not required
});

const sendFile = async (localPath, remotePath) => {
    try {
        await client.sendFile(localPath, remotePath);
        console.log('File transfer done');
    } catch (err) {
        console.error('File transfer failed:', err);
    }
}

const getFile = async (remotePath, localPath) => {
    try {
        await client.getFile(remotePath, localPath);
        console.log('File transfer done');
    } catch (err) {
        console.error('File transfer failed:', err);
    }
}

module.exports = {
    sendFile,
    getFile
};
const util = require('util');
const SambaClient = require('samba-client');

let client = new SambaClient({
    address: '//samba/shares', // required
    username: 'username', // not required, defaults to guest
    password: 'password', // not required
});
const upload = async (localPath, remotePath) => {

    try {
        await client.sendFile(localPath, remotePath);
        console.log('File transfer done');
    } catch (err) {
        console.error('File transfer failed:', err);
    }

}

let sendFileToSamba = util.promisify(upload);
module.exports = sendFileToSamba;
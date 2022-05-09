const SambaClient = require('samba-client');

let client = new SambaClient({
  address: '//samba/storage', // required
});

console.log(client);


async function test() {
    var res = await client.sendFile('somePath/file', 'destinationFolder/name');
    console.log(res);
}

test();

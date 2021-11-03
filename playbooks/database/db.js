const { Client } = require('pg');
const connectionData = {
  user: "postgres",
  host:'192.168.33.200',
  database:'databsepg',
  password:'mypassword',
  port: 5432,
};
const client = new Client(connectionData);



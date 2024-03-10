const cors = require("cors");
const express = require("express");
const consul = require('consul');
const app = express();

const backendName = process.env.BACKEND_NAME; // app-backend
const backendPort = process.env.BACKEND_PORT || 3000; // 3000
const consulHost = process.env.CONSUL_HOST;
const frontendHost = process.env.FRONTEND_HOST; // app-frontend
const frontendPort = process.env.FRONTEND_PORT; // 4000

const consulClient = new consul({ host: consulHost, port: 8500 });

consulClient.agent.service.register({
    name: backendName,
    port: Number(backendPort),
    check: {
        http: `http://${backendName}:${backendPort}/health`,
        interval: '10s'
    }
}, () => {
    console.log(`Service ${backendName} registered`);
});

consulClient.agent.service.list((err, services) => {
    if (err) throw err;

    const service = services[backendName];

    if (!service) throw new Error(`Service ${backendName} not found`);

    console.log(`Found service ${backendName} at ${service.Address}:${service.Port}`);
});

global.__basedir = __dirname;

var corsOptions = {
    origin: `http://localhost:${frontendPort}`// "http://localhost:4000"
};

app.use(cors(corsOptions));

const initRoutes = require("./routes/routes");

app.use(express.urlencoded({ extended: true }));
initRoutes(app);

let port = backendPort;
app.listen(port, () => {
    console.log(`Running at localhost:${port}`);
});
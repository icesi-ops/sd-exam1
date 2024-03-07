const cors = require("cors");
const express = require("express");
const consul = require('consul');
const app = express();

const serviceName = 'app-backend';
const servicePort = 3000;

const consulClient = new consul({ host: '127.0.0.1'});

consulClient.agent.service.register({
    name: serviceName,
    port: servicePort,
    check: {
        http: `http://127.0.0.1:${servicePort}/health`,
        interval: '10s'
    }
}, () => {
    console.log(`Service ${serviceName} registered`);
});

consulClient.agent.service.list((err, services) => {
    if (err) throw err;

    const service = services[serviceName];

    if (!service) throw new Error(`Service ${serviceName} not found`);

    console.log(`Found service ${serviceName} at ${service.Address}:${service.Port}`);
});

global.__basedir = __dirname;

var corsOptions = {
    origin: "http://localhost:4200"
};

app.use(cors(corsOptions));

const initRoutes = require("./routes/routes");

app.use(express.urlencoded({ extended: true }));
initRoutes(app);

let port = 3000;
app.listen(port, () => {
    console.log(`Running at localhost:${port}`);
});
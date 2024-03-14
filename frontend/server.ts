import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './src/main.server';
import Consul from 'consul';

const frontendName = process.env.FRONTEND_NAME; // 'app-frontend'
const frontendPort = process.env.FRONTEND_PORT; // 4000
const backendName = process.env.BACKEND_NAME; // 'app-backend'
const backendPort = process.env.BACKEND_PORT; // 3000
const serverUrl = `http://${backendName}:${backendPort}`;
const consulHost = process.env.CONSUL_HOST;

console.log('Creating Consul client');
console.log(`Consul host: ${consulHost}`);
const consul = new Consul(
  {
    host: consulHost,
    port: '8500',
    promisify: true,
  });

console.log('Registering service with Consul');
consul.agent.service.register({
  name: frontendName,
  port: Number(frontendPort),
  check: {
    http: `http://${frontendName}:${frontendPort}/health`,
    interval: '10s'
  }
}, () => {
  console.log(`Service ${frontendName} registered`);
});

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {

  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get('*.*', express.static(browserDistFolder, {
    maxAge: '1y'
  }));

  // All regular routes use the Angular engine
  server.get('*', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [
          { provide: APP_BASE_HREF, useValue: baseUrl }
        ],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  server.get('/health', (req, res) => {
    res.status(200).send('OK');
  });

  server.get('/server-url', (req, res) => {
    res.status(200).send(serverUrl);
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on ${frontendName}:${port}`);
  });
}

run();

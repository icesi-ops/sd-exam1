const http = require('http');
const fs = require('fs');

const server = http.createServer((request, response) => {
  // Si la solicitud es una solicitud GET a la raíz de la URL,
  // leer el archivo index.html y enviarlo como responsepuesta
  if (request.method === 'GET' && request.url === '/') {
    fs.readFile('/var/www/html/nodejs/public/index.html', (err, data) => {
      if (err) {
        response.writeHead(500, { 'Content-Type': 'text/plain' });
        response.end('Error interno del servidor');
      } else {
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.end(data);
      }
    });
  } else {
    // Si la solicitud no es a la raíz de la URL, devolver un error 404
    response.writeHead(404, { 'Content-Type': 'text/plain' });
    response.end('Página no encontrada');
  }
});

server.listen(3000, () => {
  console.log('Servidor corriendo en el puerto 3000');
});

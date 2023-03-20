const http = require('http');
const fs = require('fs');
const formidable = require('formidable')

const server = http.createServer(async (request, response) => {
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
  } else if (request.method === 'POST' && request.url === '/file_upload') {
    console.log('File upload');
    var form = new formidable.IncomingForm()
    form.parse(request, function (err, fields, files) {
      let path = files.textFile.filepath
      let newPath = '/mnt/uploads/' + fields.subdomain_name + '/' + files.textFile.originalFilename
      const target_directory = '/mnt/uploads/' + fields.subdomain_name;
      if (!fs.existsSync(target_directory)) {
        fs.mkdirSync(target_directory, { recursive: true })
      }
      fs.rename(path, newPath, function (error) {
        response.writeHead(200, { 'Content-Type': 'text/html' })
        response.write('<!doctype html><html><head></head><body>' +
          'Archivo subido<br><a href="/">Retornar</a></body></html>')
        response.end()
      })
    })
  } else if (request.method === 'GET' && request.url.includes('/uploads')) {
    const url = request.url;
    const filePath = '/mnt' + url;
    const isDirectory = fs.existsSync(filePath) && fs.statSync(filePath).isDirectory();
    console.log('isDirectory: ' + isDirectory);

    if (isDirectory) {
      const files = fs.readdirSync(filePath);
      const directoryListing = `
        <html>
          <head>
            <title>${url}</title>
          </head>
          <body>
            <h1>${url}</h1>
            <ul>
              ${files.map((file) => `<li><a href="${url}/${file}">${file}</a></li>`).join('')}
            </ul>
          </body>
        </html>
      `;

      response.writeHead(200, { 'Content-Type': 'text/html' });
      response.write(directoryListing);
      response.end();
    } else {
      fs.readFile(filePath, (err, data) => {
        if (err) {
          response.writeHead(500, { 'Content-Type': 'text/plain' });
          response.end('Error interno del servidor');
        } else {
          response.writeHead(200, { 'Content-Type': 'text/html' });
          response.end(data);
        }
      });

//      const fileStream = fs.createReadStream(filePath);
//      fileStream.on('error', () => {
//        response.writeHead(404, { 'Content-Type': 'text/plain' });
//        response.write('404 Not Found\n');
//        response.end();
//      });

//      response.writeHead(200, { 'Content-Type': 'text/html' });
//      fileStream.pipe(response);
    }
  } else {
    // Si la solicitud no es a la raíz de la URL, devolver un error 404
    response.writeHead(404, { 'Content-Type': 'text/plain' });
    response.end('Página no encontrada');
  }
});

server.listen(3000, () => {
  console.log('Servidor corriendo en el puerto 3000');
});

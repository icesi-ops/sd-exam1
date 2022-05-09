const http = require('http');


const Consul = require('consul');

const consul = new Consul({
    host: 'consul',
    port: 8500,
    promisify: true,
});

consul.agent.service.register({
    name: upload-files,
    address: 'localhost',
    port: 5000,
    check: {
        http: 'http://localhost:3000/health',
        interval: '10s',
        timeout: '5s',
    }
}, function(err, result) {
    if (err) {
        console.error(err);
        throw err;
    }

    Console.log (servicename + 'registered successfully! ).
})

const server = http.createServer((req, res) => {
	// show a file upload form
	res.writeHead(200, { 'Content-Type': 'text/html' });
	res.end(`
		<h2>With Node.js <code>"http"</code> module</h2>
		<form action="http://localhost:8080/api/upload" enctype="multipart/form-data" method="post">
		<div>File: <input type="file" name="multipleFiles" multiple="multiple" /></div>
		<input type="submit" value="Upload" />
		</form>
	`);
});

server.listen(5000, () => {
	console.log('Server listening on http://localhost:5000/ ...');
});
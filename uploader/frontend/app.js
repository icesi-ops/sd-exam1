const http = require('http');

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
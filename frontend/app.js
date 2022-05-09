const http = require('http');

const server = http.createServer((req, res) => {
	// show a file upload form
	if(req.url=='/' && req.method=='GET'){
		res.writeHead(200, { 'Content-Type': 'text/html' });
		const options = {
			hostname: 'localhost',
			port: '8080',
			path: '/api/files',
			method: 'GET'
		};
		const request = http.request(options, response => {
			console.log(`statusCode: ${response.statusCode}`);
			response.on('data', data => {
				var ls = String(data).split("\n");
				var ans="<h1>List of files</h1>\n";
				for (let i=0; i<ls.length; i++) {
					if(ls[i]!='') ans+=`<p>${i+1}. ${ls[i]}</p>\n`;
				}
				res.end(ans);
			});
		});
		
		request.on('error', error => {
			console.error(error);
			res.end(String(error));
		});

		request.end();
	} else if(req.url=='/upload' && req.method=='GET'){
		res.writeHead(200, { 'Content-Type': 'text/html' });
		res.end(`
			<h2>With Node.js <code>"http"</code> module</h2>
			<form action="http://localhost:8080/api/upload" enctype="multipart/form-data" method="post">
			<div>File: <input type="file" name="multipleFiles" multiple="multiple" /></div>
			<input type="submit" value="Upload" />
			</form>
		`);
	}
});

server.listen(5000, () => {
	console.log('Server listening on http://localhost:5000/ ...');
});
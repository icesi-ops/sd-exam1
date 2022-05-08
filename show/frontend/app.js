const http = require('http');

const server = http.createServer((req, res) => {
	// show a file upload form
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
});

server.listen(3030, () => {
	console.log('Server listening on http://localhost:3030/ ...');
});
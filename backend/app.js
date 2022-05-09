const http = require('http');
const formidable = require('formidable');
const { exec } = require('child_process');
const os = require('os');

var networkInterfaces = os.networkInterfaces();
var ip = networkInterfaces['eth0'][0]['address'];

console.log(networkInterfaces);


const server = http.createServer((req, res) => {
    if (req.url == '/api/upload' && req.method == 'POST') {
		// parse a file upload
		const form = formidable({ multiples: true });

		form.parse(req, (err, fields, files) => {
			if (err) {
				res.writeHead(err.httpCode || 400, { 'Content-Type': 'text/plain' });
				res.end(String(err));
				return;
			}
			res.writeHead(200, { 'Content-Type': 'application/json' });
			res.end(JSON.stringify({ fields, files }, null, 2));
            console.log("RECEIVED");
            var filepath = files.multipleFiles.filepath;
            var name = files.multipleFiles.originalFilename.replace(/ /g,"_");
            console.log(name);
            console.log(filepath);
            exec(`sh upload.sh ${filepath} ${name}`, (error, stdout, stderr) => {
                if (error) {
                    console.error(`exec error: ${error}`);
                    return;
                }
                console.log(`stdout: ${stdout}`);
                console.error(`stderr: ${stderr}`);
            });
		});
		return;
	} else if (req.url == '/api/files' && req.method == 'GET') {
		exec('sh list.sh', (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);
            res.end(stdout);
        });
        return;
	}
});

server.listen(8080, () => {
    console.log('Server listening on http://localhost:8080/ ...');
});
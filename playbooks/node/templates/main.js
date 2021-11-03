var http = require('http');
var formidable = require('formidable');
var fs = require('fs');
const ipAddress = process.env.IPADDRESS;
const serverName = process.env.SERVERNAME;

function copy(oldPath, newPath, callback) {
  var readStream = fs.createReadStream(oldPath);
  var writeStream = fs.createWriteStream(newPath);

  readStream.on('error', callback);
  writeStream.on('error', callback);

  readStream.on('close', function () {
      fs.unlink(oldPath, callback);
  });

  readStream.pipe(writeStream);
}

http.createServer(function (req, res) {
  if (req.url == '/fileupload') {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      fs.chmod(files.filetoupload.filepath, 0o666, err => {
        if (err) throw err;
        console.log("File permission changed "+files.filetoupload.filepath);
      });
      var oldpath = files.filetoupload.filepath;
      var newpath = '/mnt/glusterfs/' + files.filetoupload.originalFilename;
      copy(oldpath, newpath, function (err) {
        if (err) {res.write(JSON.stringify(err)); res.end();} // throw err;
        res.write('File uploaded and moved!');
        res.end();
      });
 });
  } else {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(`<h2>Server Name: ${serverName}</h2>`)
    res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
    res.write('<input type="file" name="filetoupload"><br>');
    res.write('<input type="submit">');
    res.write('</form>');
    return res.end();
  }
}).listen(8080, ipAddress); 
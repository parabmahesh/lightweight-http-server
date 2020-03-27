const http = require('http');
const fs = require('fs');
const path = require('path');
const ROOT_DIRECTORY = "./WebContent/";
const PORT = 4000;

function mapResourcePath(request) {
  'use strict';
  let requestUrl = request.url;
  requestUrl = requestUrl.match("/?/") ? requestUrl.split("?")[0] : requestUrl;
  const resourcePath = `${ROOT_DIRECTORY}${requestUrl}`;
  return resourcePath;
}

http.createServer(function (request, response) {
  'use strict';
  console.log("Requested Url", request.url);
  let filePath = mapResourcePath(request);
  if (filePath === './' || filePath === '') {
    filePath = './index.html';
  }

  const extname = String(path.extname(filePath)).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.woff2': 'application/font-woff2',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.wasm': 'application/wasm'
  };

  const contentType = mimeTypes[extname] || 'application/octet-stream';

  fs.readFile(filePath, function (error, content) {
    console.error("Error in file", error);
    if (error) {
      if (error.code === 'ENOENT') {
        fs.readFile('./404.html', function (error, content) {
          response.writeHead(404, {
            'Content-Type': 'text/html'
          });
          response.end(content, 'utf-8');
        });
      } else {
        response.writeHead(500);
        response.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
      }
    } else {
      response.writeHead(200, {
        'Content-Type': contentType
      });
      if (contentType === 'application/font-woff' || contentType === 'application/font-woff2') {
        response.end(content, 'binary');
      } else {
        response.end(content, 'utf-8');
      }
    }
  });

}).listen(PORT);
console.log('Server running at http://127.0.0.1:' + PORT + '/');
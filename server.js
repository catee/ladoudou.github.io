// 依赖的模块，以及一些变量的声明

var http = require('http');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var cache = {};
var port = 3333;

// 处理 404
function send404 (res) {
  res.writeHead(404, {
    'Content-Type': 'text/plain'
  });
  res.write('ERROE 404: Resource Not Found.');
  res.end();
}

// 发送文件内容
function sendFiles (res, filePath, fileContents) {
  res.writeHead(200, {
    'Content-Type': mime.lookup(path.basename(filePath))
  });
  res.end(fileContents);
}

// 静态文件处理
function serveStatic (res, cache, absPath) {
  // if (cache[absPath]) {
  absPath = absPath.split('?')[0];
  if (0) {  // 不要缓存
    fs.exists(absPath, function (exists) {
      if (exists) {
        fs.readFile(absPath, function (err, data) {
          if (!err && data != cache[absPath]) {
            cache[absPath] = data;
            sendFiles(res, absPath, data);
            return;

          }
        })
      }
    })
    sendFiles(res, absPath, cache[absPath]);
  } else {
    fs.exists(absPath, function (exists) {
      if (exists) {
        fs.readFile(absPath, function (err, data) {
          if (err) {
            var newPath = path.join(absPath, '/index.html');
            fs.exists(newPath, function (exists) {
              if (exists) {
                fs.readFile(newPath, function (err, data) {
                  if (err) {
                    send404(res);
                  } else {
                    // cache[absPath] = data;
                    sendFiles(res, newPath, data);
                  }
                });
              } else {
                send404(res);
              }
            });
          } else {
            // cache[absPath] = data;
            sendFiles(res, absPath, data);
          }
        });
      } else {
        send404(res);
      }
    });
  }
}

// 处理请求
function requestHandler (req, res) {
  var filePath = false;
  if (req.url === '/') {
    filePath = '/index.html';
  } else {
    filePath = req.url;
  }
  var absPath = path.join(__dirname, filePath);
  serveStatic(res, cache, absPath);
  console.log('loading: ' + absPath);
}

// 服务启动
function listenHandler () {
  console.log('Server Listening on ' + port + ' port...');
}

// 创建服务器
var server = http.createServer();
server.on('request', requestHandler);
server.listen(port, listenHandler);







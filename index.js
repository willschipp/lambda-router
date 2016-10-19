var http = require('http');
var httpProxy = require('http-proxy');
var url = require('url');

var proxy = httpProxy.createProxyServer().listen(5000);

proxy.on('error',function(e,req,res) {
  console.log(e);
  res.writeHead(500, {
    'Content-Type': 'text/plain'
  });
  res.end('Something went wrong. And we are reporting a custom error message.');
});

var server = http.createServer(function(req,res) {
  var parsedUrl = url.parse(req.url,true);
  var queryObject = parsedUrl.query;

  var buildUrl = 'http://' + queryObject.functionName + ':3000';

  console.log(buildUrl);

  proxy.web(req,res,{target:buildUrl});

});

server.listen(80);

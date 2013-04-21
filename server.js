var http    = require('http')
  , url     = require('url')
  , path    = require('path')
  , filesys = require('fs')
  , marked  = require('marked');


var respondToRequest = function (req, res) {
  var reqPath  = url.parse(req.url).pathname
    , filePath = path.join(process.cwd(), "content", reqPath.replace(/\.html?/, ".md"))
    , status   = 500
    , headers  = {"Content-Type": "text/plain"}
    , content  = "Something is seriously messed up.";

  if (filePath.indexOf(".ico") < 0) {
    filesys.exists(path.dirname(filePath), function (exists) {

      if (!exists) {
        status  = 404;
        content = "404 Not Found\n";
      }

      else {
        var data = handlePageRequest(res, filePath);
        return;
      }

      res.writeHeader(status, headers);
      res.write(content);
      res.end();

    });
  }
};


var handlePageRequest = function (res, filePath) {
  filesys.readFile(filePath, "binary", function (err, file) {

    var status = 500
      , headers = {'Content-Type': 'text/plain'}
      , content;

    if (err) {
      content = err + "\n";
    }

    else {
        status = 200;
        headers = {'Content-Type': 'text/html'};
        content = marked.parse(file);
    }

    res.writeHeader(status, headers);
    res.write(content);
    res.end();

  });
};

http.createServer(respondToRequest)
    .listen(8080);

console.log('rock!');

var http    = require('http')
  , url     = require('url')
  , path    = require('path')
  , filesys = require('fs')       // file system
  , marked  = require('marked')   // markdown parser
  , jade    = require('jade')     // template and layout engine
  , connect = require('connect'); // middleware



var getCompiledView = function (path, options) {
  var options = options || {filename: path};
  return jade.compile(filesys.readFileSync(path, 'utf8'), options);
}

var defaultLayout = getCompiledView('./views/layouts/default-layout.jade'),
    defaultContent = getCompiledView('./views/blocks/default-content.jade')


var respondToRequest = function (req, res) {
  var reqPath  = url.parse(req.url).pathname
    , filePath = path.join(process.cwd(), "content", reqPath.replace(/\.html?/, ".md"))
    , status   = 500
    , headers  = {"Content-Type": "text/plain"}
    , content  = "500: Server Error. Something is seriously messed up.\n";

  if (filePath.indexOf(".ico") < 0) {
    filesys.exists(path.dirname(filePath), function (exists) {

      if (!exists) {
        status  = 404;
        content = "404: Not Found\n";
      }

      else {
        handlePageRequest(res, filePath);
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
      content = "500: " + err + "\n";
    }

    else {
      status = 200;
      headers = {'Content-Type': 'text/html'};

      var title = file.slice(0, file.indexOf("\n"))
        , parse = marked.parse;

      content = defaultContent({title: title, parse: parse, markdown: file}); // marked.parse(file);
    }

    res.writeHeader(status, headers);
    res.write(content);
    res.end();
  });
};


var app = connect()
  .use(connect.favicon())
  .use(connect.logger('dev'))
  .use(connect.directory('public'))
  .use(connect.static(__dirname + '/public'))
  .use(respondToRequest)

http.createServer(app).listen(8080);

// console.log('rock!');

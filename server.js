var http    = require('http')
  , url     = require('url')
  , path    = require('path')
  , fs      = require('fs')       // file system
  , marked  = require('marked')   // markdown parser
  , jade    = require('jade')     // template and layout engine
  , connect = require('connect'); // middleware


marked.setOptions({langPrefix: "prettyprint language-"});


var getCompiledView = function (path, options) {
  var options = options || {filename: path};
  return jade.compile(fs.readFileSync(path, 'utf8'), options);
};


var views = {
  layouts: {
    default: getCompiledView('./views/layouts/default-layout.jade')
  },
  content: {
    default: getCompiledView('./views/blocks/default-content.jade')
  }
};


var getMarkdownPath = function (relativePath) {
  return path.join(process.cwd(), "content", relativePath + ".md");
}


var respondToRequest = function (req, res) {
  var reqPath  = url.parse(req.url).pathname
    , filePath = getMarkdownPath( reqPath === "/" ? "/welcome" : reqPath.replace(/\.html?/, "") )
    , status   = 500
    , headers  = {"Content-Type": "text/plain"}
    , content  = "500: Server Error. Something is seriously messed up.\n";

  fs.exists(filePath, function (exists) {

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
};


var handlePageRequest = function (res, filePath) {
  fs.readFile(filePath, "binary", function (err, file) {

    var status
      , headers
      , content;

    if (err) {
      status = 500;
      headers = {'Content-Type': 'text/plain'};
      content = "500: " + err + "\n";
    }

    else {
      var title = file.slice(0, file.indexOf("\n"))
        , parse = marked.parse;

      status = 200;
      headers = {'Content-Type': 'text/html'};
      content = views.content.default({title: title, parse: parse, markdown: file}); // marked.parse(file);
    }

    res.writeHeader(status, headers);
    res.write(content);
    res.end();

  });
};


var app = connect()
  .use(connect.favicon())
  .use(connect.logger('dev'))
  // .use(connect.directory('public'))
  .use(connect.static(__dirname + '/public'))
  .use(respondToRequest);


http.createServer(app).listen(8080);


// console.log('rock!');
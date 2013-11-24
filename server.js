var express = require('express')
  ;

var server = express();
server.config = require('./config/server');
server.controllers = require('./src/controllers')(server);

require('./config/express')(server);

server.get('/', function(req, res) {
  var posts = server.controllers.posts.latest(100);

  res.render('layout', {
      partials: { content: '_home', post_item: '_post_item', footer: '_footer', about: '_about' }
    , about: server.controllers.partials.get('about')
    , posts: posts
  });
});

server.get('/stop', function(req, res, next) {
  if(req.socket.remoteAddress == "127.0.0.1") {
    res.send("Shutting down server...");
    process.exit();
  }
  else return next();
});


var loadPartial = function(partialfile, cb) {
  if(utils.getFileExtension(partialfile) != 'md') return;

  fs.readFile(server.config.partials_directory+'/'+partialfile, {encoding: 'utf8'}, function(err, data) {
    if(err) throw err;
    partials[partialfile] = marked(data);
    if(cb) cb(partials[partialfile]);
  });
};


server.listen(server.set('port'));
console.log("Server listening on port "+server.set('port')+" in "+server.set('env')+" environment");

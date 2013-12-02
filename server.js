var express = require('express')
  , exec = require('child_process').exec
  ;

var server = express();
server.config = require('./config')(server);
require('./config/express')(server);
server.controllers = require('./src/controllers')(server);


server.get('/', function(req, res) {
  var posts = server.controllers.posts.latest(100);

  res.render('layout', {
      partials: { content: '_home', post_item: '_post_item', footer: '_footer', about: '_about' }
    , about: server.controllers.partials.get('about')
    , posts: posts
  });
});

server.get('/error', function(req, res) {
  throw new Error("Uncaught error?");
  res.send(req.body.hello.world);
});

server.post('/webhooks/github', function(req, res) {
  exec('npm install website-content', function(err, stdout, stderr) {
    server.error(err);
    server.log('stdout: ', stdout);
    server.error('exec npm stderr: ', stderr);
  });
  var payload = JSON.parse(req.body.payload);
  server.log("payload: ", payload);
  res.send('ok');
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
server.log("Server listening on port "+server.set('port')+" in "+server.set('env')+" environment");

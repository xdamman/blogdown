var express = require('express')
  ;

var server = express();
server.config = require('./config/server');
server.controllers = require('./src/controllers')(server);

require('./config/express')(server);

server.get('/', function(req, res) {
  var posts = [
      { title: "About", description: "Who am I? Why this website? What will you find here?", slug: "about" }
    , { title: "RTBF", description: "My reaction (in French) about a reportage on Belgian television about electric cars not taking off in Belgium", slug: "rtbf-voitures-electriques-belgique"} 
    , { title: "The hidden power of Twitter Custom Timelines", description: "What if the Custom Timeline could open a new way to follow your interest on Twitter with more signal and less noise?", slug: "the-hidden-power-of-twitter-custom-timelines" }
  ];

  res.render('layout', {
      partials: { content: '_home', post_item: '_post_item', footer: '_footer', about: '_about' }
    , about: server.controllers.partials.get('about')
    , posts: posts.reverse()
  });
});

server.get('/stop', function(req, res, next) {
  if(req.socket.remoteAddress == "127.0.0.1")
    process.exit();
  else
    return next();
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
console.log("Server listening on port "+server.set('port'));

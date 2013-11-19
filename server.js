var express = require('express')
  , marked = require('marked')
  , fs = require('fs')
  , utils = require('./src/lib/utils');

var server = express();
server.config = require('./config/server');

require('./config/express')(server);

var posts = {}
  , routes = {}
  ;

var buildRouteForPost = function(postfile) {
  if(utils.getFileExtension(postfile) != 'md') return;
  var filename = utils.getFileName(postfile); 
  var path = "/"+filename;

  if(routes[path]) return;
  console.log("Setting up route "+path); 

  routes[path] = { path: path, requests: 0, last_request: null };
  server.get('/'+filename, function(req, res) {
    routes[path].requests++;
    routes[path].last_request = new Date;
    console.log(routes[path]);
    res.render('layout', { 
        partials: { content: '_post', footer: '_footer' },
        content: posts[postfile]
    });
  });
};

server.get('/', function(req, res) {
  var posts = [
      { title: "About", description: "Who am I? Why this website? What will you find here?", slug: "about" }
    , { title: "RTBF", description: "My reaction (in French) about a reportage on Belgian television about electric cars not taking off in Belgium", slug: "rtbf-voitures-electriques-belgique"} 
  ];
  res.render('layout', {
      partials: { content: '_home', post_item: '_post_item', footer: '_footer' }
    , posts: posts
  });
});


var loadPost = function(postfile, cb) {
  if(utils.getFileExtension(postfile) != 'md') return;
  var path = '/'+utils.getFileName(postfile);
  if(!routes[path]) buildRouteForPost(postfile);

  console.log("Updating '"+postfile+"'");
  fs.readFile(server.config.posts_directory+'/'+postfile, {encoding: 'utf8'}, function(err, data) {
    if(err) throw err;
    posts[postfile] = marked(data);
    if(cb) cb(posts[postfile]);
  });
};


server.set('port',process.env.NODE_PORT || 3000);

var files = fs.readdirSync(server.config.posts_directory);
fs.watch(server.config.posts_directory, function(event, file) {
console.log("Event: ",event,file);
  loadPost(file);
});


for(var i=0, len=files.length; i < len; i++) {
  loadPost(files[i]);
};


server.get('/', function(req, res) {
  res.send("Hello world");
});

server.listen(server.set('port'));
console.log("Server listening on port "+server.set('port'));

var express = require('express')
  , marked = require('marked')
  , fs = require('fs')
  ;

var posts = {};

var buildRouteForPost = function(postfile) {
  var filename = postfile.substr(0,postfile.lastIndexOf('.'));
  updatePost(postfile);
  console.log("Setting up route /"+filename);
  server.get('/'+filename, function(req, res) {
    res.send(posts[postfile]);
  });
};

var extension = function(filename) {
  return filename.substr(filename.lastIndexOf('.')+1);
};

var updatePost = function(postfile, cb) {
  if(extension(postfile) != 'md') return;
  console.log("Updating "+postfile);
  fs.readFile('./posts/'+postfile, {encoding: 'utf8'}, function(err, data) {
    if(err) throw e;
    posts[postfile] = marked(data);
    if(cb) cb(posts[postfile]);
  });
};

var server = express();

server.set('port',process.env.NODE_PORT || 3000);

var files = fs.readdirSync("./posts");
fs.watch("./posts", function(event, file) {
  updatePost(file);
});

for(var i=0, len=files.length; i < len; i++) {
  buildRouteForPost(files[0]);
};


server.get('/', function(req, res) {
  res.send("Hello world");
});

server.listen(server.set('port'));
console.log("Server listening on port "+server.set('port'));

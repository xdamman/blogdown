var express = require('express')
  , path = require('path')
  ;

module.exports = function(server) {

  server.configure('development', function() {
    server.set('staticMaxAge', 0);
  });

  server.configure('production', function() {
    server.set('staticMaxAge', 86400000);
  });

  if(server.content.paths && server.content.paths.public) {
    server.use('/public', express.static(server.content.paths.public, {maxAge: 86400000}));
  }

  server.use(express.favicon(server.content.paths.theme+'/img/favicon.png'));
  server.use('/core/lib', express.static(__dirname + '/../../frontend/lib', {maxAge: server.set('staticMaxAge')}));
  server.use('/core/js', express.static(__dirname + '/../../frontend/'+server.set('basePath'), {maxAge: server.set('staticMaxAge')}));
  server.use('/core/css', express.static(__dirname + '/../../frontend/'+server.set('basePath')+'/css', {maxAge: server.set('staticMaxAge')}));
  server.use('/css', express.static(server.content.paths.theme+'/css', {maxAge: server.set('staticMaxAge')}));
  server.use('/js', express.static(server.content.paths.theme+'/js', {maxAge: server.set('staticMaxAge')}));
  server.use('/img', express.static(server.content.paths.theme+'/img', {maxAge: server.set('staticMaxAge')}));
console.log(__dirname + '/../../frontend/'+server.set('basePath')+'/js');
};

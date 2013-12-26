var express = require('express')
  , _ = require('underscore')
  , Host = require('./host')
  ;

var server = express();
server.set('basePath', __dirname+"/../..");

server.config = require(server.set('basePath')+"/config.json");

console.log("Config: ", server.config);

server.use('/core/lib', express.static(server.set('basePath') + '/core/frontend/lib', {maxAge: server.set('staticMaxAge')}));
server.use('/core/js', express.static(server.set('basePath') + '/core/frontend/js', {maxAge: server.set('staticMaxAge')}));
server.use('/core/css', express.static(server.set('basePath') + '/core/frontend/css', {maxAge: server.set('staticMaxAge')}));

// Master website
require('./server')(server);

// Hosts
server.use(function(req, res, next) {

  _.each(server.config.repositories,function(repo) {
    // We make sure the request url ends with "/" since loading css and js is relative
    if(req.url.match(new RegExp('/'+repo.path+'$','i'))) return res.redirect(req.url+'/');

    // We route the request to the appropriate host
    if(req.header('host').match(new RegExp(repo.host+'(:[0-9]+)?','i')))
      req.url = '/'+repo.path+req.url;
  });
  next();
});

// We start an expressjs server for each route and mount it on /repo.path
_.each(server.config.repositories,function(repo) {
  var host = new Host(repo);
  server.use('/'+repo.path, host);
});


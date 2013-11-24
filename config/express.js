var express = require('express');

module.exports = function(server) {

  server.configure("development", function() {
    server.set('src','src');
  });

  server.configure("production", function() {
    server.set('src','dist');
  });

  server.configure(function() {
    // simple logger
    server.use(function(req, res, next){
      console.log('%s %s %s', res.statusCode, req.method, req.url);
      next();
    });

    server.set('views', __dirname + '/../'+server.set('src')+'/views');
    server.set('view engine', 'hjs');

    var engines = require('consolidate');
    server.engine('hjs', engines.hogan);

    server.use('/public/lib', express.static(__dirname + '/../'+server.set('src')+'/public/lib', {maxAge: 86400000}));
    server.use('/public/css', express.static(__dirname + '/../'+server.set('src')+'/public/css', {maxAge: 86400000}));
    server.use('/public/js', express.static(__dirname + '/../'+server.set('src')+'/public/js', {maxAge: 86400000}));

    server.set('port',process.env.NODE_PORT || 3000);
    server.set('base_url','//xdamman.com');
  });
};

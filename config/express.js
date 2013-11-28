var express = require('express')
  ;

module.exports = function(server) {

  server.configure("development", function() {
    server.set('basePath','src');
    server.set('staticMaxAge', 0);
  });

  server.configure("production", function() {
    server.set('basePath','dist');
    server.set('staticMaxAge', 86400000);
  });

  server.configure(function() {
    // simple logger
    server.use(function(req, res, next){
      console.log('%s %s %s', res.statusCode, req.method, req.url);
      next();
    });

    server.set('views', __dirname + '/../'+server.set('basePath')+'/views');
    server.set('view engine', 'hjs');

    var engines = require('consolidate');
    server.engine('hjs', engines.hogan);

    server.use('/public', express.static(server.config.paths.public, {maxAge: 86400000}));
    server.use('/public/lib', express.static(__dirname + '/../'+server.set('basePath')+'/public/lib', {maxAge: server.set('staticMaxAge')}));
    server.use('/public/css', express.static(__dirname + '/../'+server.set('basePath')+'/public/css', {maxAge: server.set('staticMaxAge')}));
    server.use('/public/js', express.static(__dirname + '/../'+server.set('basePath')+'/public/js', {maxAge: server.set('staticMaxAge')}));

    server.set('port',process.env.NODE_PORT || 3000);
    server.set('base_url','//xdamman.com');
  });
};

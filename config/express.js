var express = require('express');

module.exports = function(server) {
  server.configure(function() {
    // simple logger
    server.use(function(req, res, next){
      console.log('%s %s %s', res.statusCode, req.method, req.url);
      next();
    });

    server.set('views', __dirname + '/../src/views');
    server.set('view engine', 'hogan.html');

    var engines = require('consolidate');
    server.engine('hogan.html', engines.hogan);

    server.use('/public/lib', express.static(__dirname + '/../lib'));
    server.use('/public/css', express.static(__dirname + '/../src/public/css'));
    server.use('/public/js', express.static(__dirname + '/../src/public/js'));

  });
};

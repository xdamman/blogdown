var express = require('express')
  , expressWinston = require('express-winston')
  , winston = require('winston')
  ;

module.exports = function(server) {

  server.set('basePath','src');

  server.configure("production","staging", function() {
    // server.set('basePath','dist');
  });

  server.configure(function() {

    server.set('port',process.env.NODE_PORT || 3000);
    server.set('base_url','//xdamman.com');

    server.use(express.bodyParser());

    server.use(expressWinston.logger({
      transports: [
        new winston.transports.Console({
            json: false
          , colorize: true
        }),
      ]
      , meta: false
      , msg: "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
    }));

    server.use(server.router); 

    require('./logger')(server);

  });

};

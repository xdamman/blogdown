var express = require('express')
  , expressWinston = require('express-winston')
  , winston = require('winston')
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

    server.use(express.bodyParser());
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

    var logger = new winston.Logger({
      transports: [
        new winston.transports.Console({
            handleExceptions: true
          , json: false
          , colorize: true
        })
      ],
      exitOnError: true
    });

    server.logger = logger;
    server.log = server.info = logger.info;
    server.warn = logger.warn;
    server.error = logger.error;

  });

  server.configure("production", function() {

    expressWinston.add(winston.transports.File,{
        filename: "logs/access.log"
      , json: false
      , timestamp: true
      , colorize: true
    });

    server.use(expressWinston.errorLogger({
      transports: [
        new winston.transports.File({
            filename: 'logs/error.log'
          , timestamp: true
          , json: true
          , colorize: true
        })
      ]
    }));

    server.logger.add(winston.transports.File, {
        filename: "logs/server.log"
      , json: false
      , timestamp: true
      , colorize: true
    })


  });
};

var express = require('express')
  , expressWinston = require('express-winston')
  , winston = require('winston')
  ;

module.exports = function(host) {

  host.configure(function() {

    host.set('port',process.env.NODE_PORT || 3000);
    host.set('base_url','//'+host.config.repository.host);

    host.use(express.bodyParser());

    host.use(expressWinston.logger({
      transports: [
        new winston.transports.Console({
            json: false
          , colorize: true
        }),
      ]
      , meta: false
      , msg: "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
    }));

    host.use(host.router); 

    require('./logger')(host);

  });

};

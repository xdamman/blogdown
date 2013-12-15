var expressWinston = require('express-winston')
  , winston = require('winston')
  ;

module.exports = function(server) {
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

}

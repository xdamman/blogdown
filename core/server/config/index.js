/*
 * ***  Don't edit this file ***
 * Edit /config/paths.js instead if you need to change the relative paths 
 * to the directories where your content lives.
 */

var fs = require('fs');

module.exports = function(server) {

  server.set('basePath', __dirname+'/../../..');

  server.config = (fs.existsSync(server.set('basePath')+'/config.json')) ? require(server.set('basePath')+'/config') : {};

  if(!server.config.repository || !fs.existsSync(server.set('basePath')+'/content')) {
    // Setup mode
    server.set('env','setup');
  }

  server.content = {};
  server.content.paths = require('./paths')(server);

  require('./express')(server);
  require('./views')(server);
  require('./assets')(server);

  server.configure('development', 'production', 'staging', function() {
    server.controllers = require('../controllers')(server);
  });

}

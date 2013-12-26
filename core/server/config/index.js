/*
 * ***  Don't edit this file ***
 * Edit /config/paths.js instead if you need to change the relative paths 
 * to the directories where your content lives.
 */

module.exports = function(server) {

  server.set('basePath', __dirname+'/../../..');

  server.content = {};
  server.content.paths = require('./paths')(server);

  require('./express')(server);
  require('./views')(server);
  require('./assets')(server);

  server.controllers = require('../controllers')(server);

}

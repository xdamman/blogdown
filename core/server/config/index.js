/*
 * ***  Don't edit this file ***
 * Edit /config/paths.js instead if you need to change the relative paths 
 * to the directories where your content lives.
 */

module.exports = function(host) {

  host.set('basePath', __dirname+'/../../..');

  host.content = {};
  host.content.paths = require('./paths')(host);

  require('./express')(host);
  require('./views')(host);
  require('./assets')(host);

  host.env = {};
  host.env[host.set('env')] = true;
  host.controllers = require('../controllers')(host);

}

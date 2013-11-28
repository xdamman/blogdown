/*
 * ***  Don't edit this file ***
 * Edit /config/paths.js instead if you need to change the relative paths 
 * to the directories where your content lives.
 */
module.exports = function(server) {
  return {
    paths: require('./paths')(server)
  };
}

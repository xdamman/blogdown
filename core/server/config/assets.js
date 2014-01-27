var express = require('express')
  , path = require('path')
  ;

module.exports = function(host) {

  host.configure('development','staging', function() {
    host.set('staticMaxAge', 0);
  });

  host.configure('production', function() {
    host.set('staticMaxAge', 86400000);
  });

  if(host.content.paths && host.content.paths.public) {
    host.use('/public', express.static(host.content.paths.public, {maxAge: 86400000}));
    host.use(express.favicon(host.content.paths.theme+'/img/favicon.png'));
  }

  host.use('/css', express.static(host.content.paths.theme+'/css', {maxAge: host.set('staticMaxAge')}));
  host.use('/js', express.static(host.content.paths.theme+'/js', {maxAge: host.set('staticMaxAge')}));
  host.use('/lib', express.static(host.content.paths.theme+'/lib', {maxAge: host.set('staticMaxAge')}));
  host.use('/img', express.static(host.content.paths.theme+'/img', {maxAge: host.set('staticMaxAge')}));
};

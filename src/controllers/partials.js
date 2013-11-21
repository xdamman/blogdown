var marked = require('marked')
  , fs = require('fs')
  , utils = require('../lib/utils')
  ;
  
module.exports = function(server) {

  var partials = {};

  var loadPartial = function(partialfile, cb) {
    if(utils.getFileExtension(partialfile) != 'md') return;
    console.log("Loading partial '"+partialfile+"'");

    utils.loadDoc(server.config.partials_directory+'/'+partialfile, function(err, doc) {
      if(err) return cb(err);
      partials[partialfile] = doc; 
      if(cb) cb(doc);
    });
  };

  var init = function() {

    fs.watch(server.config.partials_directory, function(event, file) {
      loadPartial(file);
    });

    var files = fs.readdirSync(server.config.partials_directory);

    for(var i=0, len=files.length; i < len; i++) {
      loadPartial(files[i]);
    };

  };

  init();

  return {

    get: function(slug) {
      var data = partials[slug+'.md'];
      return data;
    },
  
    reload: function(slug, cb) {
      loadPartial(slug+'.md', cb);
    }

  };

};


var marked = require('marked')
  , fs = require('fs')
  , utils = require('../lib/utils')
  ;
  
module.exports = function(server) {

  var partials = {};

  var loadPartial = function(partialfile, cb) {
    if(utils.getFileExtension(partialfile) != 'md') return;
    server.log("Loading partial '"+partialfile+"'");

    utils.loadDoc(server.content.paths.partials+'/'+partialfile, function(err, doc) {
      if(err) {
        server.error("loadPartial: "+server.content.paths.partials+'/'+partialfile, err);
        if(cb) return cb(err);
      }
      doc.html = utils.stripTags(doc.html, "<a><b><u><i>");
      partials[partialfile] = doc; 
      if(cb) cb(doc);
    });
  };

  var init = function() {

    fs.watch(server.content.paths.partials, function(event, file) {
      loadPartial(file);
    });

    var files = fs.readdirSync(server.content.paths.partials);

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


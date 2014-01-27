var fs = require('fs')
  , utils = require('../lib/utils')
  , libdoc = require('../lib/doc')
  ;
  
module.exports = function(host) {

  var partials = {};

  var loadPartial = function(partialfile, cb) {
    if(utils.getFileExtension(partialfile) != 'md') return;
    host.log("Loading partial '"+partialfile+"'");

    libdoc.loadDoc(host.content.paths.partials+'/'+partialfile, function(err, doc) {
      if(err) {
        host.error("loadPartial: "+host.content.paths.partials+'/'+partialfile, err);
        if(cb) return cb(err);
      }
      doc.html = utils.stripTags(doc.html, "<a><b><u><i>");
      partials[partialfile] = doc; 
      if(cb) cb(doc);
    });
  };

  var init = function(cb) {

    var cb = cb || function() {};

    if(!fs.existsSync(host.content.paths.partials)) return cb(new Error(host.content.paths.partials + ' does not exist'));

    fs.watch(host.content.paths.partials, function(event, file) {
      loadPartial(file);
    });

    var files = fs.readdirSync(host.content.paths.partials);

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


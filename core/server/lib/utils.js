var fs = require('fs')
  , crypto = require('crypto')
  , showdown = require('showdown')
  , exec = require('child_process').exec
  , request = require('request')
  , _ = require('underscore')
  ;

module.exports = {

  getFileExtension: function(file) {
    return file.substr(file.lastIndexOf('.')+1);
  },

  getFileName: function(file) {
    var r=file.replace(/^.*(\\|\/|\:)/, '');
    return r.substr(0,r.lastIndexOf('.'));
  },

  readJSON: function(file) {
    var data = fs.readFileSync(file, {encoding: 'utf8'});
    var json;
    try {
      json = JSON.parse(data);
    } catch(e) {
    }
    return json;
  },

  writeJSON: function(file, json) {
    fs.writeFileSync(file, JSON.stringify(json, null, 2));
  },

  getHash: function(str) {
    return crypto.createHash('md5').update(str).digest('hex');
  },

  stripTags: function(input, allowed) {
    if (typeof input != 'string') {
      return '';
    }
    var allowed = (((allowed || "") + "").toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join('');
    var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
        commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;

    return input.replace(commentsAndPhpTags, '').replace(tags, function($0, $1) {
      if ($0.toLowerCase().substring(0, 2) == '<a') {
        var matches = $0.match(/href=[\'"]?([^\'" >]+)/i);
        if(!matches || matches.length<2) return '';

        var href = matches[1]
          , classes = ''
          , target = '';

        matches = $0.match(/class=[\'"]?([^\'">]+)/i);
        if (matches && matches.length > 1) {
          classes = matches[1] || '';
        }

        matches = $0.match(/target=[\'"]?([^\'">]+)/i);
        if (matches && matches.length > 1) {
          target = matches[1] || '';
        }

        $0 = $0.indexOf(' ') > -1 ? $0.substr(0, $0.indexOf(' ')) + '>' : $0;
        $0 = $0.substring(0, $0.length - 1) + ' href="' + href + '"';
        if (classes) $0 += ' class="'+classes+'"';
        if (target) $0 += ' target="'+target+'"';
        $0 += '>';
      } else {
        $0 = $0.indexOf(' ') > -1 ? $0.substr(0, $0.indexOf(' ')) + '>' : $0;
      }
      return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
    });
  }

};

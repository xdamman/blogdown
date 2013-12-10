var fs = require('fs')
  , showdown = require('showdown')
  ;

module.exports = {

  getFileExtension: function(file) {
    return file.substr(file.lastIndexOf('.')+1);
  },

  getFileName: function(file) {
    var r=file.replace(/^.*(\\|\/|\:)/, '');
    return r.substr(0,r.lastIndexOf('.'));
  },

  // @PRE a markdown file with email like properties at the top
  // @POST an object with each of the properties defined at the top of the markdown file
  //       with also an html attribute with the output of the markdown parser
  loadDoc: function(file, cb) { 
    cb = cb || function() {};
    var self = this;

    var parseAttribute = function(line) {
      var matches = line.match(/([a-zA-Z]+):\ ?(.+)/);
      if(!matches || matches.length < 3) return false;
      return {key: matches[1], value: matches[2] };
    };

    fs.readFile(file, {encoding: 'utf8'}, function(err, data) {
      if(err) return cb(err);
      var lines = data.split('\n')
        , doc = {}
        , i = 0
        ;

      while(i < lines.length && parseAttribute(lines[i])) {
        var attr = parseAttribute(lines[i]);
        doc[attr.key] = attr.value;
        i++;
      }

      var markdown_lines = lines.slice(i);
      var converter = new showdown.converter({extensions: ['twitter','table']});
      doc.html = converter.makeHtml(markdown_lines.join('\n'));
      var matches = doc.html.match(/^<h1[^>]*>(.*)(<\/h1>)$/m,'$1');
      if(matches && matches.length == 3) {
        doc.title = matches[1];
        doc.html = doc.html.replace(/^<h1[^>]*>(.*)(<\/h1>)$/m,'');
      }

      doc.html = doc.html.replace(/<table>/g,'<div class="table-responsive"><table class="table table-hover">');
      doc.html = doc.html.replace(/<\/table>/g,'</table></div>');

      // Get lead (first paragraph after title)
      if(doc.title && !doc.lead) {
        var matches = doc.html.match(/^<p[^>]*>(.*)(<\/p>)$/m,'$1');
        if(matches) {
          doc.lead = matches[1];
          doc.html = doc.html.replace(/^<p[^>]*>(.*)(<\/p>)$/m,'');
        }
      }

      // Extract orphan images from their paragraph <p><img></p> -> <img>
      doc.html = doc.html.replace(/^<p>(<img.*)(<\/p>)$/mg,'$1')

      doc.slug = self.getFileName(file);

      var stat = fs.statSync(file);
      doc.created_at = stat.ctime;
      doc.updated_at = stat.mtime;
      doc.date = (doc.date) ? new Date(doc.date) : doc.created_at;
    
      return cb(null, doc);
    });

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

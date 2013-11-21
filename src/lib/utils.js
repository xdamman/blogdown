var fs = require('fs')
  , marked = require('marked')
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
      doc.html = marked(markdown_lines.join('\n'));
      var matches = doc.html.match(/^<h1[^>]*>(.*)(<\/h1>)$/m,'$1');
      if(matches && matches.length == 3) {
        doc.title = matches[1];
        doc.html = doc.html.replace(/^<h1[^>]*>(.*)(<\/h1>)$/m,'');
      }
      doc.html = doc.html.replace(/^<p>(<img.*)(<\/p>)$/mg,'$1')
      doc.slug = self.getFileName(file);

      var stat = fs.statSync(file);
      doc.created_at = stat.ctime;
      doc.updated_at = stat.mtime;
    
      return cb(null, doc);
    });

  }

};

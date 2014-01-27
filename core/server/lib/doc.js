var fs = require('fs')
  , utils = require('./utils')
  , showdown = require('showdown')
  , exec = require('child_process').exec
  , request = require('request')
  , _ = require('underscore')
  ;

module.exports = {

  getContributors: function(file, cb) {
    this.getCommits(file, function(err, commits) {
      if(err) return cb(err);
      var contributors = {};
      _.each(commits, function(commit) {
        var contributor = {
            name: commit.author
          , email: commit.email
        };

        if(!contributors[commit.email]) {
          contributors[commit.email] = contributor;
          contributors[commit.email].commits = 1;
          contributors[commit.email].avatar = '//gravatar.com/avatar/'+utils.getHash(commit.email);
        }
        else
          contributors[commit.email].commits++;
      });

      return cb(err, _.toArray(contributors));
    });

  },

  getCommits: function(file, cb) {
    var filename = utils.getFileName(file)+'.'+utils.getFileExtension(file);
    var cwd = file.replace(filename,'');

    var cmd = 'git log --pretty=format:\'{"hash":"%h","date":"%ad","author":"%an","email":"%ae","subject":"%s","body":"%b"}\' -- '+filename;

    if(!fs.existsSync(file)) {
      var error = "File "+file+" does not exist";
      console.error("lib/posts:getCommits: " + error);
      return cb(new Error(error));
    }

    exec(cmd, {timeout: 500, cwd: cwd}, function(err, stdout, stderr) {

      var lines = stdout.split('\n');
      var json_str = '['+lines.join(',')+']';
      
      try {
        var json = JSON.parse(json_str);
      }
      catch(e) {
        console.error("Unable to parse commits for "+filename, json_str,e);
        return cb(new Error("Unable to parse json"));
      }

      return cb(err, json);

    });
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
      var converter = new showdown.converter({extensions: ['twitter','table','prettify']});
      doc.html = converter.makeHtml(markdown_lines.join('\n'));
      var matches = doc.html.match(/^<h1[^>]*>(.*)(<\/h1>)$/m,'$1');
      if(matches && matches.length == 3) {
        doc.title = matches[1];
        doc.html = doc.html.replace(/^<h1[^>]*>(.*)(<\/h1>)$/m,'');
      }

      doc.html = doc.html.replace(/<table>/g,'<div class="table-responsive"><table class="table table-hover">');
      doc.html = doc.html.replace(/<\/table>/g,'</table></div>');

      // Extract orphan images from their paragraph <p><img></p> -> <img>
      doc.html = doc.html.replace(/^<p>(<img.*)(<\/p>)$/mg,'$1')

      // Get lead (first text paragraph after title)
      if(doc.title && !doc.lead) {
        var paragraphs = doc.html.match(/^<p[^>]*>(.*)(<\/p>)$/gm);
        if(paragraphs) {
          doc.lead = paragraphs[0].replace(/<p[^>]*>(.*)<\/p>/,'$1');
          doc.html = doc.html.replace(paragraphs[0],'<p class="lead">'+doc.lead+'</p>');
        }
      }

      doc.slug = utils.getFileName(file);

      var stat = fs.statSync(file);
      doc.created_at = stat.ctime;
      doc.updated_at = stat.mtime;
      doc.date = (doc.date) ? new Date(doc.date) : doc.created_at;

      doc.draft = (doc.draft == 'true') ? true : false;
    
      return cb(null, doc);
    });

  }

};

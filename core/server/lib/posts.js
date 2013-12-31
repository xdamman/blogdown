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
        if(!contributors[commit.author]) {
          contributors[commit.author] = commit;
          contributors[commit.author].commits = 1;

          var hash = crypto.createHash('md5').update(commit.email).digest('hex');
          contributors[commit.author].avatar = '//gravatar.com/avatar/'+hash;
        }
        else
          contributors[commit.author].commits++;
      });
      return cb(err, _.toArray(contributors));
    });

  },

  getAuthor: function(contributors, cb) {

    if(!contributors || contributors.length < 1) return cb();

    var author = contributors[0];
    var api_call = "https://api.github.com/search/users?q="+author.email+"%20in:email";
    var options = { url: api_call, headers: { 'User-Agent': 'Blogdown' } };
    console.log("Calling "+api_call);
    request(options, function(err, res, body) {
      res = JSON.parse(body);
      if(res.total_count==1)
        author.github = res.items[0];
    });
    cb(null, {});

  },

  getCommits: function(file, cb) {
    var filename = utils.getFileName(file)+'.'+utils.getFileExtension(file);
    var cwd = file.replace(filename,'');

    var cmd = 'cd '+cwd+' && git log --pretty=format:\'{"hash":"%h","date":"%ad","author":"%an","email":"%ae","subject":"%s","body":"%b"}\' -- '+filename;

    exec(cmd, function(err, stdout, stderr) {
      var lines = stdout.split('\n');
      var json_str = '['+lines.join(',')+']';
      
      try {
        var json = JSON.parse(json_str);
        return cb(err, json);
      }
      catch(e) {
        console.error("Unable to parse commits for "+filename, json_str,e);
        return cb(new Error("Unable to parse json"));
      }


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

      doc.slug = utils.getFileName(file);

      var stat = fs.statSync(file);
      doc.created_at = stat.ctime;
      doc.updated_at = stat.mtime;
      doc.date = (doc.date) ? new Date(doc.date) : doc.created_at;
    
      self.getContributors(file, function(err, contributors) {
        doc.contributors = contributors;
        self.getAuthor(contributors, function(err, author) {
          doc.author = author;
          return cb(null, doc);
        });
        // console.log("Contributors for "+utils.getFileName(file), contributors);
      });
    });

  },
  

};

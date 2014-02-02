var fs = require('fs')
  , utils = require('../lib/utils')
  , async = require('async')
  , libdoc = require('../lib/doc')
  ;
  
module.exports = function(host, cb) {

  var libcontributors = require('./contributors')(host);

  var routes = routes || {};
  host.posts = host.posts || {};

  var loadPost = function(postfile, cb) {
    cb = cb || function() {};
    if(utils.getFileExtension(postfile) != 'md') return cb(new Error("Invalid file "+postfile));
    var postfilepath = host.content.paths.posts+'/'+postfile;
    libdoc.loadDoc(postfilepath, function(err, doc) {
      if(err) return cb(err);
      doc.permalink = host.set("base_url") + "/" + doc.slug;
      doc.contributors = [];
      libdoc.getContributors(postfilepath, function(err, contributors) {
        if(err) {
          console.error('Error trying to get contributors for '+postfile,err);
          return cb(err);
        }
        // We load asynchronously the profile for all contributors
        async.each(contributors, function(contributor, done) {
          if(!contributor || !contributor.email) done();
          libcontributors.fetchProfile(contributor.email, function(err, profile) {
            doc.contributors.push(profile);
            done(err, profile);
          });
        }, function(err) {
          if(err) console.error("Error while asynchronously loading contributors", err);
          doc.author = doc.contributors[0] || {};
          doc.contributors = doc.contributors.slice(1);
          host.posts[utils.getFileName(postfile)] = doc; 
          buildRouteForPost(postfile);
          return cb(null, doc);
        });
      });
    });
  };

  var buildRouteForPost = function(postfile) {
    if(utils.getFileExtension(postfile) != 'md') return;
    var filename = utils.getFileName(postfile); 
    var path = "/"+filename;

    if(routes[path]) return;
    host.log("Setting up route /"+host.config.repository.path+path); 

    routes[path] = { path: path, requests: 0, last_request: null };
    host.get('/'+filename, function(req, res) {
      routes[path].requests++;
      routes[path].last_request = new Date;
      res.set("Cache-Control","public, max-age=62");
      res.render('post', { 
          about: host.controllers.partials.get('about'),
          pages: host.pages,
          title: host.posts[filename].title,
          post: host.posts[filename],
          template: host.posts[filename].template || 'post',
          config: host.config,
          env: host.env 
      });
    });
  };

  var init = function(cb) {

    fs.watch(host.content.paths.posts, function(event, file) {
      loadPost(file);
    });

    var files = fs.readdirSync(host.content.paths.posts);

    async.each(files, loadPost, function(err) {
      console.error(err);
      if(cb) return cb(err);
    });

  };

  init(cb);

  return {

    get: function(slug) {
      return host.posts[slug];
    },
  
    latest: function(max) {
      var posts_array = [];
      for(var i in host.posts) {
        if(!host.posts[i].draft && !host.posts[i].hidden) {
          var post = host.posts[i];
          posts_array.push(post);
        }
      }
      posts_array = posts_array.sort(function(a,b) { return (a.date<b.date) ? 1 : -1; });
      return posts_array.slice(0,max);
    },

    reload: function(slug, cb) {
      loadPost(slug+'.md', cb);
    }

  };

};

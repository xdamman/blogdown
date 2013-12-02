var marked = require('marked')
  , fs = require('fs')
  , utils = require('../lib/utils')
  ;
  
module.exports = function(server) {

  var posts = {}, routes = {};

  var loadPost = function(postfile, cb) {
    if(utils.getFileExtension(postfile) != 'md') return;
    server.log("Loading '"+postfile+"'");
    utils.loadDoc(server.config.paths.posts+'/'+postfile, function(err, doc) {
      if(err) return cb(err);
      doc.permalink = server.set("base_url") + "/" + doc.slug;
      posts[postfile] = doc; 
      buildRouteForPost(postfile);
      if(cb) cb(doc);
    });
  };

  var buildRouteForPost = function(postfile) {
    if(utils.getFileExtension(postfile) != 'md') return;
    var filename = utils.getFileName(postfile); 
    var path = "/"+filename;

    if(routes[path]) return;
    server.log("Setting up route "+path); 

    routes[path] = { path: path, requests: 0, last_request: null };
    server.get('/'+filename, function(req, res) {
      routes[path].requests++;
      routes[path].last_request = new Date;
      res.set("Cache-Control","public, max-age=62");
      res.render('layout', { 
          partials: { content: '_post', footer: '_footer', about: '_about' },
          about: server.controllers.partials.get('about'),
          title: posts[postfile].title,
          post: posts[postfile]
      });
    });
  };

  var init = function() {

    fs.watch(server.config.paths.posts, function(event, file) {
      loadPost(file);
    });

    var files = fs.readdirSync(server.config.paths.posts);

    for(var i=0, len=files.length; i < len; i++) {
      loadPost(files[i]);
    };

  };

  init();

  return {

    get: function(slug) {
      return posts[slug+'.md'];
    },
  
    latest: function(max) {
      var posts_array = [];
      for(var i in posts) {
        posts_array.push(posts[i]);
      }
      posts_array = posts_array.sort(function(a,b) { return (a.date<b.date); });
      return posts_array.slice(0,max);
    },

    reload: function(slug, cb) {
      loadPost(slug+'.md', cb);
    }

  };

};

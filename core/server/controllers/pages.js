var fs = require('fs')
  , utils = require('../lib/utils')
  , async = require('async')
  , libdoc = require('../lib/doc')
  ;
  
module.exports = function(host, cb) {

  var libcontributors = require('./contributors')(host);

  var routes = routes || {};
  host.pages = host.pages || {};

  var loadPost = function(postfile, cb) {
    cb = cb || function() {};
    if(utils.getFileExtension(postfile) != 'md') return cb(new Error("Invalid file "+postfile));
    var postfilepath = host.content.paths.pages+'/'+postfile;
    libdoc.loadDoc(postfilepath, function(err, doc) {
      if(err) return cb(err);
      doc.permalink = host.set("base_url") + "/" + doc.slug;
      doc.contributors = [];
      libdoc.getContributors(postfilepath, function(err, contributors) {
        // We load asynchronously the profile for all contributors
        async.each(contributors, function(contributor, done) {
          if(!contributor || !contributor.email) done();
          libcontributors.fetchProfile(contributor.email, function(err, profile) {
            doc.contributors.push(profile);
            done(err, profile);
          });
        }, function(err) {
          if(err) console.error("Error while asynchronously loading contributors", err);
          doc.author = doc.contributors[0];
          doc.contributors = doc.contributors.slice(1);
          host.pages[utils.getFileName(postfile)] = doc; 
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
      console.log("post: ", host.pages[filename].contributors);
      res.render('post', { 
          about: host.controllers.partials.get('about'),
          pages: host.pages,
          title: host.pages[filename].title,
          post: host.pages[filename],
          template: host.pages[filename].template || 'page',
          config: host.config,
          env: host.env 
      });
    });
  };

  var init = function(cb) {

    var cb = cb || function() {};

    if(!fs.existsSync(host.content.paths.pages)) return cb(new Error(host.content.paths.pages + ' does not exist'));

    fs.watch(host.content.paths.pages, function(event, file) {
      loadPost(file);
    });

    var files = fs.readdirSync(host.content.paths.pages);

    async.each(files, loadPost, function(err) {
      console.error(err);
      return cb(err);
    });

  };

  init(cb);

  return {

    get: function(slug) {
      return host.pages[slug];
    },
  
    latest: function(max) {
      var pages_array = [];
      for(var i in host.pages) {
        if(!host.pages[i].draft && !host.pages[i].hidden)
          pages_array.push(host.pages[i]);
      }
      pages_array = pages_array.sort(function(a,b) { return (a.date<b.date); });
      return pages_array.slice(0,max);
    },

    reload: function(slug, cb) {
      loadPost(slug+'.md', cb);
    }

  };

};


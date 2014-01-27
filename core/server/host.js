var express = require('express')
  , RSS = require('rss')
  , _ = require('underscore')
  ;

module.exports = function(repo) {

  var host = express();

  host.use(function(req, res, next) {
    if(req.param('env')) {
      host.env = {}
      host.env[req.param('env')] = true;
    }
    next();
  });


  repo.title = repo.title || repo.name;

  host.config = { repository: repo, host: repo.host, base_url: '/'+repo.path };
  require('./config/index')(host);

  host.get('/', function(req, res) {
    var posts = host.controllers.posts.latest(100);

    res.render('home', {
        about: host.controllers.partials.get('about')
      , posts: posts
      , template: 'home page'
      , config: host.config
      , env: host.env 
    });
  });

  host.get('/rss', function(req, res) {
    res.header("Content-Type","application/rss+xml");

    var posts = host.controllers.posts.latest(10);
    
    var feed = new RSS({
        title: repo.title
      , description: repo.description
      // , image_url: 'http:'+host.set('base_url')+'/img/favicon.png' 
      , language: 'en'
    });

    _.each(posts, function(post) {
      feed.item({
          title: post.title
        , description: post.html
        , url: post.permalink
        , categories: post.tags
        , author: post.author.displayName
        , date: post.created_at
      });
    });

    res.send(feed.xml());
    
  });

  host.get('/error', function(req, res) {
    throw new Error("Uncaught error?");
    res.send(req.body.hello.world);
  });

  return host;

}

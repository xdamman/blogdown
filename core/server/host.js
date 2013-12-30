var express = require('express')
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

  host.get('/error', function(req, res) {
    throw new Error("Uncaught error?");
    res.send(req.body.hello.world);
  });

  return host;

}

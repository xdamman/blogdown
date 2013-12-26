var express = require('express')
  ;

module.exports = function(repo) {

  var host = express();

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
    });
  });

  host.get('/error', function(req, res) {
    throw new Error("Uncaught error?");
    res.send(req.body.hello.world);
  });

  return host;

}

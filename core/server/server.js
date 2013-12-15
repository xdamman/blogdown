var express = require('express')
  , exec = require('child_process').exec
  , utils = require('./lib/utils')
  , _ = require('underscore')
  , fs = require('fs')
  ;

var server = express();

require('./config/index')(server);


if(server.set('env') == 'setup') {
  server.get('/(setup)?', function(req, res) {
    // server.alert = {class: "info", msg: "Cloning the repository - please wait"};
    return res.render('setup', {
        alert: server.alert
      , template: 'setup page'
    });
  });
}

server.get('/', function(req, res) {
  var posts = server.controllers.posts.latest(100);

  res.render('home', {
      about: server.controllers.partials.get('about')
    , posts: posts
    , template: 'home page'
    , config: server.config
  });
});

server.get('/error', function(req, res) {
  throw new Error("Uncaught error?");
  res.send(req.body.hello.world);
});

server.all('/webhooks/github', function(req, res) {
  try {
    var payload = JSON.parse(req.body.payload);
  } catch(e) {
    var payload = {
        repository: {
            name: "website-content"
          , url: "https://github.com/xdamman/website-content"
          , private: false
          , owner: {
                name: "Xavier Damman"
              , email: "xdamman@gmail.com"
            }
        }
    };
  }

  if(server.set('env') == 'setup') {
    server.config.repository = payload.repository;
    server.alert = {class: "info", msg: "Cloning the repository "+payload.repository.url+" - please wait"};
    exec('git clone '+payload.repository.url+' content', function(err, stdout, stderr) {
      server.error(err);
      server.error('exec git clone stderr: ', stderr);
      server.log('exec git clone stdout: ', stdout);

      if(fs.existsSync(server.set('basePath')+'/content/blogdown.json')) {
        var config = require(server.set('basePath')+'/content/blogdown');
        _.extend(server.config, config);
      }
      else {
        server.log("File "+server.set('basePath')+"/content/blogdown.json does not exist");
      }
      utils.writeJSON('./config.json', server.config);
      server.log("updating config.json");
      
      process.exit();
    });

    res.send("Setup done");
    return;
  }

  server.log('cd '+server.set('basePath')+'/content && git pull origin master');
  exec('cd '+server.set('basePath')+'/content && git pull origin master', function(err, stdout, stderr) {
    server.error(err);
    server.log('stdout: ', stdout);
    server.error('exec npm stderr: ', stderr);
  });
  server.log("payload: ", payload);
  res.send('ok');
});

server.get('/stop', function(req, res, next) {
  if(req.socket.remoteAddress == "127.0.0.1") {
    res.send("Shutting down server...");
    process.exit();
  }
  else return next();
});

server.get('/reset', function(req, res, next) {
  if(req.socket.remoteAddress == "127.0.0.1") {
    delete server.config.repository;
    utils.writeJSON('./package.json', server.config);
    exec("rm -rf content", function() {
      server.log("rm -rf content", arguments);
      process.exit();
    });
    return res.send("Resetting server...");
  }
  else return next();
});

server.listen(server.set('port'));
server.log("Server listening on port "+server.set('port')+" in "+server.set('env')+" environment");

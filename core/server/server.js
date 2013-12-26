var fs = require('fs')
  , _ = require('underscore')
  , exec = require('child_process').exec
  , utils = require('./lib/utils')
  ;

module.exports = function(server) {

  server.set('port', process.env.PORT || 3000);

  require('./config/views')(server);

  server.get('/', function(req, res) {
    // server.alert = {class: "info", msg: "Cloning the repository - please wait"};
    return res.render('setup', {
        alert: server.alert
      , template: 'setup page'
    });
  });

  var updateConfig = function(repo) {
    var configFile = server.set('basePath')+'/repositories/'+repo.path+'/blogdown';
    if(fs.existsSync(configFile+'.json')) {
      var config = require(configFile);
      _.extend(repo, config);
    }
    else {
      console.log("File "+configFile+".json does not exist");
    }
    server.config.repositories = server.config.repositories || {};
    server.config.repositories[repo.path] = repo;
    utils.writeJSON('./config.json', server.config);
    console.log("updating config.json");
  }

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
      /*
      var payload = {
          repository: {
              name: "engineering-blog"
            , url: "https://github.com/Livefyre/engineering-blog"
            , private: false
            , owner: {
                  name: "Xavier Damman"
                , email: "xdamman@gmail.com"
              }
          }
      }
      */
    }

    var repo = payload.repository;
    var tokens = payload.repository.url.match(/https?:\/\/github\.com\/([^\/]+)\/([^\/]+)/);
    repo.owner.username = tokens[1];
    repo.path = tokens[1]+'/'+tokens[2];
    repo.owner.username = tokens[1]; 

    if(!fs.existsSync(server.set('basePath')+'/repositories/'+repo.path)) {
    console.log("File "+server.set('basePath')+'/repositories/'+repo.path+" does not exist");
      server.alert = {class: "info", msg: "Cloning the repository "+payload.repository.url+" - please wait"};

      console.log('git clone '+payload.repository.url+' repositories/'+repo.path);

      exec('git clone '+payload.repository.url+' repositories/'+repo.path, function(err, stdout, stderr) {
        console.error(err);
        console.error('exec git clone stderr: ', stderr);
        console.log('exec git clone stdout: ', stdout);
        updateConfig(repo);
        process.exit();
      });

      res.send("Setup done");
      return;
    }

    console.log('cd '+server.set('basePath')+'/repositories/'+repo.path+' && git pull origin master');
    exec('cd '+server.set('basePath')+'/repositories/'+repo.path+' && git pull origin master', function(err, stdout, stderr) {
      console.error(err);
      console.log('stdout: ', stdout);
      console.error('exec npm stderr: ', stderr);
      updateConfig(repo);
    });
    console.log("payload: ", payload);
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
      // delete repo;
      utils.writeJSON('./package.json', server.config);
      exec("rm -rf content", function() {
        console.log("rm -rf content", arguments);
        process.exit();
      });
      return res.send("Resetting server...");
    }
    else return next();
  });

  server.listen(server.set('port'));
  console.log("Server listening on port "+server.set('port')+" in "+server.set('env')+" environment");

};

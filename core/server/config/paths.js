module.exports = function(server) {

  var themePath;

  if(server.config.theme) {
    themePath = server.set('basePath')+'/content/themes/'+server.config.theme;
  }
  else {
    themePath = server.set('basePath')+'/themes/default';
  }

  var paths = {
      posts: server.set('basePath')+'/content/posts' 
    , partials: server.set('basePath')+'/content/partials' 
    , public: server.set('basePath')+'/content/public'
    , theme: themePath
  };

  return paths;

}

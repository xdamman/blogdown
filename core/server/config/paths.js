module.exports = function(host) {

  var themePath;

  if(host.config.repository.theme) {
    themePath = host.set('basePath')+'/repositories/'+host.config.repository.path+'/themes/'+host.config.repository.theme;
  }
  else {
    themePath = host.set('basePath')+'/themes/default';
  }

  var paths = {
      posts: host.set('basePath')+'/repositories/'+host.config.repository.path+'/posts' 
    , partials: host.set('basePath')+'/repositories/'+host.config.repository.path+'/partials' 
    , pages: host.set('basePath')+'/repositories/'+host.config.repository.path+'/pages' 
    , public: host.set('basePath')+'/repositories/'+host.config.repository.path+'/public'
    , theme: themePath
  };

  return paths;

}

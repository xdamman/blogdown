module.exports = function(server) {

  var baseDir = __dirname+'/../../../'
    , themePath;

  if(server.config.theme) {
    themePath = baseDir+'content/themes/'+server.config.theme;
  }
  else {
    themePath = baseDir+'themes/default';
  }

  var paths = {
      posts: baseDir+'content/posts' 
    , partials: baseDir+'content/partials' 
    , public: baseDir+'content/public'
    , theme: themePath
  };


  return paths;

}

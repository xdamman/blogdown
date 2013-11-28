module.exports = function(server) {

  var contentBasePath = __dirname+"/../content"; 

  return {
      posts: contentBasePath + "/posts"
    , partials: contentBasePath + "/partials" 
    , public: contentBasePath + "/public"
  };

}

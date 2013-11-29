var content = require('website-content');

module.exports = function(server) {

  return {
      posts: content.getPath('posts') 
    , partials: content.getPath('partials') 
    , public: content.getPath('public') 
  };

}

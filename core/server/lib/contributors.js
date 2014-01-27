var utils = require('./utils')
  , request = require('request')
  ;

module.exports = { 

  fetchGithubInfo: function(email, cb) {
    var githubProfile = {};

    var api_call = "https://api.github.com/search/users?q="+email+"%20in:email";
    var options = { url: api_call, headers: { 'User-Agent': 'Blogdown' } };
    console.log("Calling "+api_call);
    request(options, function(err, res, body) {
      if(err) return cb(err);
      res = JSON.parse(body);
      if(res.total_count==1)
        githubProfile = res.items[0];
      cb(null, githubProfile);
    });
  },

  fetchGravatarProfile: function(email, cb) {
    var gravatarProfile = {};

    var hash = utils.getHash(email); 
    var api_call = "http://en.gravatar.com/"+hash+".json";
    console.log("Calling "+api_call);
    var options = { url: api_call, headers: { 'User-Agent': 'Blogdown' } };
    request(options, function(err, res, body) {
      if(err) return cb(err);
      try {
        res = JSON.parse(body);
      } catch(e) {
        console.error("fetchGravatarProfile: Couldn't parse response JSON ", body, e); 
        return cb(e);
      }
      if(res.entry && res.entry.length > 0)
        gravatarProfile = res.entry[0];

      return cb(null, gravatarProfile);
    });
  }
};

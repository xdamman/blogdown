var crypto = require('crypto')
  , request = require('request')
  ;

module.exports = function(host) {

  var self = this;

  this._contributors = {}; // in memory caching of contributors

  this.getHash: function(str) {
  };

  return {

    profile: function(email) {

      self.fetchGithubInfo(email, function(err, res

    }

  };

};

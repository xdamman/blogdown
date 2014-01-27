var lib = require('../lib/contributors')

module.exports = function(server) {

  var self = this;

  server.contributors = server.contributors || {};

  this.fetchProfile = function(email, cb) {
    var cb = cb || function() {};

    if(server.contributors[email]) return cb(null, server.contributors[email]);
    server.contributors[email] = {};

    lib.fetchGravatarProfile(email, function(err, profile) {
      server.contributors[email] = self.normalize(profile);
      return cb(err, server.contributors[email]);
    });

  };

  this.normalize = function(gravatarProfile) {

    var profile = {};
    profile.username = gravatarProfile.preferredUsername;
    profile.description = gravatarProfile.aboutMe;
    profile.displayName = gravatarProfile.displayName;
    profile.location = gravatarProfile.currentLocation;

    if(gravatarProfile.accounts && gravatarProfile.accounts.length > 0) {
      for(var i=0; i<gravatarProfile.accounts.length;i++) {
        var account = gravatarProfile.accounts[i];
        profile[account.shortname] = { username: account.username, url: account.url, displayName: account.display };
        profile.username = profile.username || account.username;
        profile.url = profile.url || account.url;
        profile.displayName = profile.displayName || account.display;
      }
      if(profile.twitter) {
        profile.displayName = profile.twitter.displayName;
        profile.url = profile.twitter.url;
      }
    }

    return profile;

  };

  return this;

};

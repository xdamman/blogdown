var expect = require('chai').expect;
var basePath = "../../../core/server/";
var lib = require(basePath+'lib/contributors');
var utils = require(basePath+'lib/utils');

var email = "xdamman@gmail.com";

describe('lib/contributors', function() {

  it('fetches the github profile', function(done) {
    this.timeout(5000);

    lib.fetchGithubInfo(email, function(err, res) {
      expect(err).to.not.exist;
      expect(res.id).to.equal(74358);
      done();
    });

  });

  it('fetches the gravatar profile', function(done) {

    lib.fetchGravatarProfile(email, function(err, res) {
      expect(err).to.not.exist;
      expect(res.hash).to.equal(utils.getHash(email));
      done();
    });

  });

});

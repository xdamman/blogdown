var expect = require('chai').expect;

var server = {};

var contributors = require('../../../core/server/controllers/contributors')(server);

describe('contributors', function() {

  it('fetches the gravatar profile and store it to server.contributors', function(done) {
    this.timeout(5000);

    contributors.fetchProfile('xdamman@gmail.com', function(err, profile) {
      expect(err).to.not.exist;
      expect(profile.username).to.equal('xdamman');
      expect(server.contributors['xdamman@gmail.com']).to.exist;
      expect(server.contributors['xdamman@gmail.com'].username).to.equal('xdamman');
      done();
    });
  });

  it('gets the contributor from cache', function(done) {
    this.timeout(1000);
    
    expect(server.contributors['xdamman@gmail.com']).to.exist;
    contributors.fetchProfile('xdamman@gmail.com', function(err, profile) {
      expect(err).to.not.exist;
      expect(server.contributors['xdamman@gmail.com']).to.exist;
      expect(server.contributors['xdamman@gmail.com'].username).to.equal('xdamman');
      done();
    });

  });

});

var expect = require('chai').expect;
var lib = require('../../../core/server/lib/doc.js');

var email = "xdamman@gmail.com";

describe("parser", function() {

  it("parses the parameters in the head", function(done) {
    lib.loadDoc(__dirname+'/../../mocks/post.md', function(err, doc) {
      expect(err).to.not.exist;
      expect(doc.draft).to.equal(true);
      expect(doc.slug).to.equal('post');
      expect(doc.title).to.equal('This is the title');
      expect(doc.lead).to.equal('The first text paragraph should be the lead');
      done();
    });
  });

  it("parses a large post with image", function(done) {

    lib.loadDoc(__dirname+'/../../mocks/large-post.md', function(err, doc) {
      expect(err).to.not.exist;
      done();

    });

  });

  it('get the contributors', function(done) {
    lib.getContributors(__dirname+'/../../mocks/post.md', function(err, contributors) {
      expect(err).to.not.exist;
      expect(contributors.length).to.equal(1);
      expect(contributors[0].email).to.equal('xdamman@gmail.com');
      done();
    });

  });

  it('get the commits', function(done) {
    lib.getCommits(__dirname+'/../../mocks/post.md', function(err, commits) {
      expect(err).to.not.exist;
      expect(commits.length).to.equal(1);
      expect(commits[0].hash).to.exist;
      done();
    });
  });

});


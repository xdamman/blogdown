var expect = require('chai').expect;
var lib = require('../../../core/server/lib/posts.js');

var email = "xdamman@gmail.com";

describe("parser", function() {

  it("parses the parameters in the head", function(done) {
    lib.loadDoc(__dirname+'/../../mocks/post.md', function(err, doc) {
      expect(err).to.not.exist;
      expect(doc.draft).to.equal('true');
      expect(doc.slug).to.equal('post');
      expect(doc.title).to.equal('This is the title');
      expect(doc.lead).to.equal('And this is the lead');
      expect(doc.author.email).to.equal(email);
      expect(doc.author.twitter.username).to.equal('xdamman');
      done();
    });
  });

});


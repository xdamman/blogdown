var expect = require('chai').expect;
var server = require('../../server');

describe('posts', function() {
  var posts;
  
  before(function(done) {
    posts = require('../../../core/server/controllers/posts')(server, done);
  });

  it('load a post', function(done) {
    this.timeout(3000);
    expect(server.posts['post'].author.username).to.equal('xdamman');
    done();
  });

  it('posts.get', function(done) {
    var post = posts.get('post');
    expect(post.author.username).to.equal('xdamman');
    done();
  });

});


module.exports = function(server) {
  return {
    posts: require('./posts')(server),
    pages: require('./pages')(server),
    partials: require('./partials')(server)
  }
};

module.exports = function(server) {
  return {
    posts: require('./posts')(server),
    partials: require('./partials')(server)
  }
};

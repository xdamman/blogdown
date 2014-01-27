var express = require('express');
var server = express();

server.content = { 
  paths: {
    posts: __dirname+'/../../tests/mocks'
  }
};

server.config = {
  repository: {
    path: 'test'
  }
};

server.log = function(msg) {
  console.log(msg);
}

module.exports = server;


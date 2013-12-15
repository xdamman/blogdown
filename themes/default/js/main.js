ENV = (window.location.port) ? "development" : "production";

var scripts = {
  "production" : ["prettify", "domReady!", "timeago!"],
  "development" : ["prettify", "domReady!","timeago!"]
};

require(scripts[ENV], function(prettify) {

  prettify.prettyPrint();

});

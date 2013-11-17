ENV = (window.location.port) ? "development" : "production";

require.config({
  baseUrl: "/public/js/",
  paths: {
  }
});

var scripts = {
  "production" : [],
  "development" : ["livereload"]
};

require(scripts[ENV]);

console.log("Hello world from main.js");

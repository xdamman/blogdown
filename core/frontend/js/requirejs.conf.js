require.config({
  baseUrl: "/js/",
  paths: {
      domReady: "../core/lib/requirejs-domready/domReady"
    , timeago: "../core/js/timeago"
    , prettify: "../core/lib/google-code-prettify/src/prettify"
    , jquery: '../core/lib/jquery/jquery'
  },
  packages: [{
     name: "core",
     location: "../core/js"
  },{
     name: "website-tests",
     location: "tests"
  }],
  shim: {
    jquery: {
        exports: '$'
    }
  }
});

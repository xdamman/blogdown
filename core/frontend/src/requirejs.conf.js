require.config({
  baseUrl: "/js/",
  paths: {
      moment: "../core/lib/momentjs/moment"
    , domReady: "../core/lib/requirejs-domready/domReady"
    , timeago: "../core/js/timeago"
    , SyntaxHighlighter: "../core/lib/SyntaxHighlighter/scripts/shCore"
    , prettify: "../core/lib/google-code-prettify/src/prettify"
    , jquery: '../core/lib/jquery/jquery'
    , text: '../core/lib/requirejs-text/text'
    , base64: '../core/lib/base64/base64'
    , hogan: '../core/lib/hogan/web/builds/2.0.0/hogan-2.0.0.amd'
    , hgn: '../core/lib/requirejs-hogan-plugin/hgn'
    , jasmine: '../core/lib/jasmine/../core/lib/jasmine-../core/jasmine'
    , 'jasmine-html': '../core/lib/jasmine/../core/lib/jasmine-../core/jasmine-html'
    , 'jasmine-jquery': '../core/lib/jasmine-jquery/../core/lib/jasmine-jquery'
    , 'twitter-text': '../core/lib/twitter-text/twitter-text'
    , inherits: '../core/lib/inherits/inherits'
    , 'event-emitter': '../core/lib/event-emitter/src/event-emitter'
    , mocha: '../core/lib/mocha/mocha'
    , chai: '../core/lib/chai/chai'
    , json: '../core/lib/requirejs-plugins/src/json'
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
    },
    jasmine: {
        exports: 'jasmine'
    },
    'jasmine-html': {
        deps: ['jasmine'],
        exports: 'jasmine'
    },
    'jasmine-jquery': {
        deps: ['jquery', 'jasmine']
    }
  }
});

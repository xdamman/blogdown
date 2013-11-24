require.config({
  baseUrl: "/public/js/",
  paths: {
      moment: "../lib/momentjs/moment"
    , domReady: "../lib/requirejs-domready/domReady"
    , jquery: '../lib/jquery/jquery'
    , text: '../lib/requirejs-text/text'
    , base64: '../lib/base64/base64'
    , hogan: '../lib/hogan/web/builds/2.0.0/hogan-2.0.0.amd'
    , hgn: '../lib/requirejs-hogan-plugin/hgn'
    , jasmine: '../lib/jasmine/lib/jasmine-core/jasmine'
    , 'jasmine-html': '../lib/jasmine/lib/jasmine-core/jasmine-html'
    , 'jasmine-jquery': '../lib/jasmine-jquery/lib/jasmine-jquery'
    , 'twitter-text': '../lib/twitter-text/twitter-text'
    , inherits: '../lib/inherits/inherits'
    , 'event-emitter': '../lib/event-emitter/src/event-emitter'
    , mocha: '../lib/mocha/mocha'
    , chai: '../lib/chai/chai'
    , json: '../lib/requirejs-plugins/src/json'
  },
  packages: [{
     name: "website",
     location: "js"
  },{
    name: "lib",
    location: "public/lib"
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

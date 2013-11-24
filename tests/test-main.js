var tests = [];
for (var file in window.__karma__.files) {
  if (window.__karma__.files.hasOwnProperty(file)) {
    if (/tests\/spec\/.*\.js$/.test(file)) {
      tests.push(file);
    }
  }
}

requirejs.config({
    // Karma serves files from '/base'
    baseUrl: '/base/public/js',

    packages: [{
       name: "website",
       location: "src"
    },{
       name: "website-tests",
       location: "tests"
    }],

    paths: {
        'jquery': 'lib/jquery',
        'json': 'lib/requirejs-plugins/src/json',
        'text': 'lib/requirejs-text/text',
        'underscore': 'lib/underscore'
    },

    shim: {
        'underscore': {
            exports: '_'
        }
    },

    // ask Require.js to load these files (all our tests)
    deps: tests,

    // start test run, once Require.js is done
    callback: window.__karma__.start
});


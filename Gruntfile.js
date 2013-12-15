module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    copy: {
      dist: {
        files: [
           { cwd: 'core/frontend/src/', src: '**', dest: 'core/frontend/dist/', expand: true, filter: function(filepath) { return (!(filepath.match(/public\/css\//) || filepath.match(/public\/js\//))); } }
         , { cwd: 'core/frontend/lib/bootstrap/dist/css/', src: 'bootstrap.css', dest: 'core/frontend/src/css/', expand: true }
        ]
      }
    },
    // Remove unused CSS across multiple files, compressing the final output
    uncss: {
      dist: {
        files: [
          { src: 'themes/default/*.hbs', dest: 'core/frontend/dist/css/compiled.min.css'}
          ]
        },
        options: {
            compress: false
          , ignore: ["p","h1","h2","h3","h4","ul","li",".about p",".post h2", "blockquote","body.page","body.page .lead","body.page #footer", ".post-item .timeago", ".twitter-tweet","table",".table-responsive",".table-hover","table p","thead","tr","td","tbody",".table","th",".table > tbody > tr > td",".table > thead > tr > th",".table > thead:first-child > tr:first-child > th", "body.home h4", "body.page .post-item p"]
          , stylesheets: ['core/frontend/lib/bootstrap/dist/css/bootstrap.css']
        }
    },
    processhtml: {
      dist: {
        files: {
          'core/frontend/dist/views/layout.hjs': ['themes/default/layout.hjs']
        }
      }
    },
    requirejs: {
      compile: {
        options: {
          almond: true,
          name: "main",
          baseUrl: "core/frontend/src/",
          mainConfigFile: "core/frontend/src/requirejs.conf.js",
          include: ['timeago','analytics', 'domReady','prettify'],
          out: "core/frontend/dist/js/optimized.min.js",
          optimize: 'uglify2',
          preserveLicenseComments: false
        }
      }
    },
    bumper: {
      options: {
          files: ['package.json','bower.json']
        , pushTo: 'deploy'
        , runTasks: false 
      }
    },
    asset_cachebuster: {
      options: {
          buster: "<%= pkg.version %>"
        , htmlExtension: "hbs"
      },
      dist: {
        files: {
          'core/frontend/dist/views/layout.hjs':['themes/default/layout.hjs']
        }
      }
    },
    shell: {
      'npm-stop': {
        command: "npm stop"
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-uncss');
  grunt.loadNpmTasks('grunt-processhtml');
  grunt.loadNpmTasks('grunt-requirejs');
  grunt.loadNpmTasks('grunt-bumper');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-asset-cachebuster');

  // Default task(s).
  grunt.registerTask('default', ['copy','uncss','requirejs','processhtml','asset_cachebuster']);
  grunt.registerTask('deploy', ['default','bumper']);

};

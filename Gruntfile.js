module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    copy: {
      dist: {
        files: [
           { cwd: 'src/', src: '**', dest: 'dist/', expand: true, filter: function(filepath) { return (!(filepath.match(/public\/css\//) || filepath.match(/public\/js\//))); } }
         , { cwd: 'src/public/lib/bootstrap/dist/css/', src: 'bootstrap.css', dest: 'src/public/css/', expand: true }
        ]
      }
    },
    // Remove unused CSS across multiple files, compressing the final output
    uncss: {
      dist: {
        files: [
          { src: 'src/views/*.hjs', dest: 'dist/public/css/compiled.min.css'}
          ]
        },
        options: {
            compress:true
          , csspath: "../"
          , ignore: ["p","h1","h2","h3","h4","ul","li",".about p",".post h2"]
          //, stylesheets: ['src/public/lib/bootstrap/dist/css/bootstrap.css','src/public/css/main.css']
        }
    },
    processhtml: {
      dist: {
        files: {
          'dist/views/layout.hjs': ['src/views/layout.hjs']
        }
      }
    },
    requirejs: {
      compile: {
        options: {
          almond: true,
          name: "main",
          baseUrl: "src/public/js",
          mainConfigFile: "src/public/js/requirejs.conf.js",
          include: ['timeago','analytics', 'domReady'],
          out: "dist/public/js/optimized.min.js",
          optimize: 'uglify2',
          preserveLicenseComments: false
        }
      }
    },
    bumper: {
      options: {
          files: ['package.json','bower.json']
        , pushTo: 'deploy/master'
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-uncss');
  grunt.loadNpmTasks('grunt-processhtml');
  grunt.loadNpmTasks('grunt-requirejs');
  grunt.loadNpmTasks('grunt-bumper');

  // Default task(s).
  grunt.registerTask('default', ['copy','uncss', 'processhtml','requirejs']);

};

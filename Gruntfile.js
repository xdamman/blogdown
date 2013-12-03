module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    prompt: {
      dist: {
        options: {
          questions: [
            {
              config: 'config.content-repo', // arbitray name or config for any other    grunt task
              type: 'input', // list, checkbox, confirm, input, password
              message: 'Please enter the url of the git repository to use for content', 
              validate: function(value) {
                if(/git(\+ssh)?:\/\/.+(\.git)$/i.test(value)) return true;
                else return "Invalid URL. Should be a git url as given by git remote -v, e.g. git://github.com:xdamman/website-content.git"
              },
              default: "git://github.com/xdamman/website-content.git",
              filter: function(value) {
                var pkg = grunt.config.get('pkg');
                pkg.dependencies['website-content'] = value;
                grunt.file.write('./package.json',JSON.stringify(pkg, null, 2));
                grunt.task.run(['shell:npm-install-website-content']);
                return value;
              }, // modify the answer
              when: function() {
                return (!grunt.config.get('pkg').dependencies['website-content']);
              }
            }
          ]
        }
      }
    },
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
        , pushTo: 'deploy'
        , runTasks: false
      }
    },
    asset_cachebuster: {
      options: {
          buster: "<%= pkg.version %>"
        , htmlExtension: "hjs"
      },
      dist: {
        files: {
          'dist/views/layout.hjs':['dist/views/layout.hjs']
        }
      }
    },
    shell: {
      'npm-install-website-content': {
        command: "npm install website-content"
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-uncss');
  grunt.loadNpmTasks('grunt-prompt');
  grunt.loadNpmTasks('grunt-processhtml');
  grunt.loadNpmTasks('grunt-requirejs');
  grunt.loadNpmTasks('grunt-bumper');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-asset-cachebuster');

  // Default task(s).
  grunt.registerTask('default', ['copy','uncss','requirejs','processhtml','asset_cachebuster']);
  grunt.registerTask('deploy', ['default','bumper']);

};

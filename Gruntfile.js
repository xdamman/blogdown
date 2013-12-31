module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    bumper: {
      production: {
        options: {
            files: ['package.json','bower.json']
          , pushTo: 'deploy'
          , runTasks: false 
        }
      },
      staging: {
        options: {
            files: ['package.json','bower.json']
          , pushTo: 'staging'
          , runTasks: false 
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
  grunt.loadNpmTasks('grunt-bumper');
  grunt.loadNpmTasks('grunt-shell');

  // Default task(s).
  grunt.registerTask('deploy', ['bumper']);
  grunt.registerTask('default',[]);

};

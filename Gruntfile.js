'use strict';

module.exports = function(grunt){
  grunt.initConfig({
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        background: true
      },
      travis: {
        configFile: 'karma.conf.js',
        singleRun: true,
        browsers: ['PhantomJS']
      }
    },
    watch: {
      karma: {
        files: ['src/**/*.js', 'test/**/*.js'],
        tasks: ['karma:unit:run']
      }
    },
    bower: {
      install: {
        options: {
          verbose: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-bower-task');

  grunt.registerTask('testdev', ['karma:unit', 'watch']);

  grunt.registerTask('test', ['bower:install','karma:travis']);
};
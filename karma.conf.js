'use strict';

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', 'requirejs'],
    files: [
      'test/test-main.js',
      {pattern: 'src/*.js', included: false},
      {pattern: 'test/*Spec.js', included: false},
      {pattern: 'bower_components/**/*.js', included: false}
    ],
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['PhantomJS'],
    singleRun: false
  });
};

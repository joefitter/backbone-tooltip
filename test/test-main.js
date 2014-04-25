'use strict';

var tests = [];
for(var file in window.__karma__.files) {
  if(window.__karma__.files.hasOwnProperty(file)) {
    if(/Spec\.js$/.test(file)) {
      tests.push(file);
    }
  }
}

require.config({
  baseUrl: '/base/src',
  paths: {
    jquery: '../bower_components/jquery/dist/jquery',
    backbone: '../bower_components/backbone/backbone',
    underscore: '../bower_components/underscore/underscore'
  },
  
  deps: tests,

  callback: window.__karma__.start
});
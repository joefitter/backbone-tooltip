require.config({
  paths: {
    'backbone': 'vendor/backbone/backbone',
    'underscore': 'vendor/underscore/underscore',
    'jquery': 'vendor/jquery/dist/jquery',
    'stache': 'vendor/requirejs-mustache/stache',
    'text': 'vendor/requirejs-text/text',
    'mustache': 'vendor/mustache/mustache'
  },
  shim: {
    backbone: {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },
    underscore: {
      exports: '_'
    }
  },
  stache: {
    extension: '.template',
    path: '../templates/'
  }
});

require([
  'BaseView'
], function(
  BaseView
){
  'use strict';

  $(function(){
    var baseView = new BaseView({
      el: $('#root-element')
    });
    baseView.render();
  });
});
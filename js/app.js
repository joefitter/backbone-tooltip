requirejs.config({
  baseUrl: '/',
  paths: {
    'backbone': 'bower_components/backbone/backbone',
    'underscore': 'bower_components/underscore/underscore',
    'jquery': 'bower_components/jquery/dist/jquery'
  }
})

define([
	'bower_components/backbone-tooltip/src/backbone-tooltip.amd'
], function(
  Tooltip
){
  'use strict';

  $(function(){
    $('input[type=text]').focus(function(){
      var $this = $(this);
      new Tooltip({
        target: $this,
        text: $this.attr('data-tooltip'),
        align: $this.attr('data-align'),
        type: $this.attr('data-context')
      });
    });
    $('a[data-trigger]').each(function(){
      var $this = $(this);
      new Tooltip({
        target: $this,
        type: 'success',
        trigger: $this.attr('data-trigger'),
        exit: $this.attr('data-exit')
      });
    });
  });
});
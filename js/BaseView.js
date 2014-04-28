define([
	'backbone',
  'stache!base',
  'vendor/backbone-tooltip/src/backbone-tooltip.amd'
], function(
  Backbone,
  baseTemplate,
  Tooltip
){
  'use strict';

  return Backbone.View.extend({
    initialize: function(options){
      this.options = options || {};
    },
    render: function(){
      this.$el.html(baseTemplate());
      this.addCustomEvents();
      return this;
    },
    events: {
      'focus input[data-bbtooltip]': 'showElementTooltip',
      'click #default-triggers a': 'showElementTooltip',
      'click #data-attributes a': 'showJqueryTooltip'
    },
    addCustomEvents: function(){
      var self = this;
      $('[data-bbtooltip-trigger]', this.el).each(function(){
        self.showTooltip($(this));
      });
    },
    showJqueryTooltip: function(event){
      var $el = $(event.target);
      var tooltip = new Tooltip($el);
      if($el.attr('data-bbtooltip-feedback')){
        this.listenTo(tooltip, 'confirmed', function(){
          window.alert('ok!');
          tooltip.exit();
        });
      }
    },
    showTooltip: function($el){
      var tooltip = new Tooltip({
        $el: $el,
        text: $el.attr('data-bbtooltip'),
        align: $el.attr('data-bbtooltip-align'),
        timeout: $el.attr('data-bbtooltip-timeout'),
        context: $el.attr('data-bbtooltip-context'),
        trigger: $el.attr('data-bbtooltip-trigger'),
        exit: $el.attr('data-bbtooltip-exit'),
        speed: $el.attr('data-bbtooltip-speed'),
        interrupt: $el.attr('data-bbtooltip-interrupt'),
        feedback: $el.attr('data-bbtooltip-feedback'),
        animation: $el.attr('data-bbtooltip-animation'),
        prefix: $el.attr('data-bbtooltip-prefix')
      });
      if($el.attr('data-bbtooltip-feedback')){
        this.listenTo(tooltip, 'confirmed', function(){
          window.alert('Thanks for confirming!!');
          tooltip.exit();
        });
      }
    },
    showElementTooltip: function(event){
      var $el = $(event.target);
      if($el.attr('data-bbtooltip-trigger')){
        return;
      }
      this.showTooltip($el);
    }
  });
});
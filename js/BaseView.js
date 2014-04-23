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
      'focus input[data-tooltip]': 'showElementTooltip',
      'click #default-triggers a': 'showElementTooltip',
      'click #data-attributes a': 'showJqueryTooltip'
    },
    addCustomEvents: function(){
      var self = this;
      $('a[data-trigger]', this.el).each(function(){
        self.showTooltip($(this));
      });
    },
    showJqueryTooltip: function(event){
      var $el = $(event.target);
      var tooltip = new Tooltip($el);
    },
    showTooltip: function($el){
      var tooltip = new Tooltip({
        $el: $el,
        text: $el.attr('data-tooltip'),
        align: $el.attr('data-align'),
        timeout: $el.attr('data-timeout'),
        context: $el.attr('data-context'),
        trigger: $el.attr('data-trigger'),
        exit: $el.attr('data-exit'),
        speed: $el.attr('data-speed'),
        interrupt: $el.attr('data-interrupt'),
        feedback: $el.attr('data-feedback')
      });
      if($el.attr('data-feedback')){
        this.listenTo(tooltip, 'confirmed', function(){
          window.alert('Thanks for confirming!!');
          tooltip.exit();
        });
      }
    },
    showElementTooltip: function(event){
      var $el = $(event.target);
      if($el.attr('data-trigger')){
        return;
      }
      this.showTooltip($el);
    }
  });
});
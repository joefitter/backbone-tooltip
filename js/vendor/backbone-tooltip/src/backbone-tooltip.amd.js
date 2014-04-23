define([
  'backbone'
], function(
  Backbone
) {
  return Backbone.View.extend({
    className: 'tooltip',
    borderWidth: 2,
    arrowSize: 10,
    initialize: function(options) {
      if(options instanceof jQuery){
        this.options = this.parseDataAttributes(options);
      } else {
        this.options = options || {};
      }
      if(!this.options.$el){
        throw new Error('Tooltip needs a target element');
        return;
      }
      this.options.speed = this.options.speed === undefined ? 200 : parseInt(this.options.speed, 10);
      var self = this,
        currentTooltip = this.options.$el.data('activeTooltip');
      if(currentTooltip){
        if(currentTooltip.options.interrupt) {
          return;
        }
        currentTooltip.destroy();
      }
      this.options.$el.data('activeTooltip', this);
      this.id = this.options.id || null;

      this.elemWidth = this.options.$el.outerWidth();
      this.elemHeight = this.options.$el.outerHeight();
      
      this.options.rootElem = this.options.rootElem || $('body');
      this.options.moveUp = this.options.moveUp || 0;
      this.render();
      if(!this.options.trigger){
        this.addEvents();
        this.show();
      } else {
        this.enterHandler = _.bind(this.show, this);
        this.exitHandler = _.bind(this.hide, this);
        this.options.$el.bind(this.options.trigger, this.enterHandler);
      }
    },
    parseDataAttributes: function($el){
      var ops = {};
      ops.$el = $el;
      ops.align = $el.attr('data-align');
      ops.context = $el.attr('data-context');
      ops.text = $el.attr('data-tooltip');
      ops.timeout = $el.attr('data-timeout');
      ops.interrupt = $el.attr('data-interrupt');
      ops.trigger = $el.attr('data-trigger');
      ops.exit = $el.attr('data-exit');
      ops.feedback = $el.attr('data-feedback');
      ops.speed = $el.attr('data-speed');
      return ops;
    },
    events: {
      'click button.tooltip-confirm': 'confirmTooltip',
      'click button.tooltip-deny': 'exit'
    },
    confirmTooltip: function() {
      this.trigger('confirmed', this);
      return false;
    },
    show: function(){
      this.$el.stop().fadeIn(this.options.speed);
      if(this.options.trigger){
        this.options.$el.unbind(this.options.trigger, this.enterHandler);
        this.options.$el.bind(this.options.exit, this.exitHandler);
      }
    },
    addEvents: function() {
      var self = this;
      this.clickHandler = _.bind(this.clicked, this);
      this.keypressHandler = _.bind(this.keypressed, this);
      $(window).bind('mousedown', this.clickHandler);
      $(window).bind('keydown', this.keypressHandler);
      if (this.options.hoverTrigger) {
        this.options.$el.on('mouseleave', function(e) {
          self.mouseLeaveHandler(e);
        });
        this.$el.on('mouseleave', function(e) {
          self.mouseLeaveHandler(e);
        });
      }
      if (this.options.interrupt) {
        var elems = $('*').filter(function() {
          return $(this).data('activeTooltip') !== undefined;
        });
        elems.each(function(i, item) {
          if (item !== self.options.$el.get(0)) {
            var ttip;
            if (ttip = $(item).data('activeTooltip')) {
              if(ttip.options.trigger){
                if(ttip.$el.is(':visible')){
                  ttip.hide();
                }
              } else {
                ttip.exit();  
              }
            }
          }
        });
      }
    },
    clicked: function(e) {
      var isTargetElem = this.options.$el.get(0) === $(e.target).get(0) || this.options.$el.find($(e.target)).length > 0,
        isTooltip = $(e.target).hasClass('tooltip') || $(e.target).parents('.tooltip').length > 0 || false;
      if (!isTargetElem && !isTooltip) {
        this.exit();
      }
    },
    mouseLeaveHandler: function(e) {
      var isTooltip = $(e.toElement).get(0) === this.$el.get(0) || this.$el.find($(e.toElement)).length > 0 || false,
        isTargetElem = this.options.$el.get(0) === $(e.toElement).get(0) || this.options.$el.find($(e.toElement)).length > 0 || false;
      if (!isTargetElem && !isTooltip) {
        this.exit();
      }
    },
    keypressed: function(e) {
      if (e.keyCode === 9) {
        this.exit();
      }
    },
    render: function() {
      var self = this;
      this.$el.html(_.template('<div class="arrow"></div>\
        <span><%= options.text %></span>\
        <% if(options.feedback) { %>\
          <div class="feedback-buttons">\
              <button class="btn btn-primary tooltip-confirm">Yes</button>\
              <button class="btn btn-primary tooltip-deny">No</button>\
          </div>\
        <% } %>')(this));
      this.options.rootElem.append(this.el);
      this.addClasses();
      this.getSize();
      if (this.options.timeout) {
        setTimeout(function() {
          self.exit();
        }, this.options.timeout);
      }
      return this;
    },
    getSize: function() {
      this.$el.show();
      this.width = this.$el[0].clientWidth + 2 * this.borderWidth;
      this.height = this.$el[0].clientHeight + 2 * this.borderWidth;
      this.$el.hide();
      this.positionSelf();
    },
    positionSelf: function() {
      var rootElemOffset = this.options.rootElem.offset(),
        scrollTop = this.options.rootElem.prop('tagName') === "BODY" ? 0 : this.options.rootElem.get(0).scrollTop,
        pos = this.options.$el.offset();
      pos.top = pos.top - rootElemOffset.top + scrollTop;
      pos.left = pos.left - rootElemOffset.left;
      switch (this.options.align) {
        case 'top':
          pos.top = pos.top - this.height - this.arrowSize;
          pos.left = pos.left - ((this.width - this.elemWidth) / 2);
          break;
        case 'right':
          pos.top = pos.top - ((this.height - this.elemHeight) / 2);
          pos.left = pos.left + this.elemWidth + this.arrowSize;
          break;
        case 'bottom':
          pos.top = pos.top + this.elemHeight + this.arrowSize;
          pos.left = pos.left - ((this.width - this.elemWidth) / 2);
          break;
        case 'left':
          pos.top = pos.top - ((this.height - this.elemHeight) / 2);
          pos.left = pos.left - this.width - this.arrowSize;
          break;
        default:
          pos.top = pos.top - this.height - this.arrowSize;
          pos.left = pos.left - ((this.width - this.elemWidth) / 2);
      }
      this.$el.css(pos);
    },
    exit: function() {
      var self = this;
      this.$el.fadeOut(this.options.speed, function() {
        self.destroy();
      });
      return false;
    },
    hide: function(){
      this.$el.stop().fadeOut(this.options.speed);
      if(this.options.trigger){
        this.options.$el.unbind(this.options.exit, this.exitHandler);
        this.options.$el.bind(this.options.trigger, this.enterHandler);
      }
    },
    destroy: function() {
      this.undelegateEvents();
      this.options.$el.data('activeTooltip', null);
      $(window).unbind('click', this.clickHandler);
      $(window).unbind('keydown', this.keypressHandler);
      this.options.$el.off('mouseleave');
      if(this.options.trigger){
        this.options.$el.unbind(this.options.exit, this.exitHandler);
        this.options.$el.unbind(this.options.trigger, this.enterHandler);
      }
      this.$el.off('mouseleave');
      this.$el.removeData().unbind();
      this.remove();
      Backbone.View.prototype.remove.call(this);
    },
    addClasses: function() {
      var type, align;
      switch (this.options.context) {
        case 'info':
          type = 'info';
          break;
        case 'success':
          type = 'success';
          break;
        case 'error':
          type = 'error';
          break;
        case 'warning':
          type = 'warning';
          break;
        default:
          type = '';
      }
      this.$el.addClass(type);
      switch (this.options.align) {
        case 'top':
          align = 'align-top';
          break;
        case 'right':
          align = 'align-right';
          break;
        case 'bottom':
          align = 'align-bottom';
          break;
        case 'left':
          align = 'align-left';
          break;
        default:
          align = 'align-top';
      }
      this.$el.addClass(align);
    }
  });
});
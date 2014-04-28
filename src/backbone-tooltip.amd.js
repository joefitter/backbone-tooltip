/*global _,define*/
/*jshint strict:false*/

define([
  'jquery',
  'backbone'
], function(
  $,
  Backbone
) {
  /* leaving out use strict statement so
     can be included in non-strict modules */

  return Backbone.View.extend({
    className: 'tooltip',
    arrowSize: 10,
    initialize: function(options) {
      if (!options || typeof options !== 'object') {
        throw new Error('Tooltip needs to be provided with a jQuery element object or options hash');
      }

      /*
       * Check if Tooltip was instantiated with
       * a jQuery object or an options hash.
       */
      if (options instanceof $) {
        this.options = this.parseDataAttributes(options);
      } else {
        this.options = options;
      }

      /*
       * Check if a target element has been provided
       * and it is a jQuery object
       */
      if (this.options.$el === undefined || !(this.options.$el instanceof $)) {
        throw new Error('Tooltip needs a target element');
      }

      if (this.options.text === undefined || this.options.text === '') {
        throw new Error('Sorry, no tooltip text was provided.');
      }

      // Feedback and Timout are incompatible options
      if (this.options.feedback && this.options.timeout) {
        throw new Error('Sorry, cannot timeout tooltip while awaiting feedback');
      }

      // If speed not specified, set to 200ms by default
      this.options.speed = this.options.speed === undefined ? 200 : parseInt(this.options.speed, 10);

      // If animation not specified, set to 'fade' by default
      this.options.animation = this.options.animation || 'fade';

      if (this.options.prefix === undefined) {
        var prefix;
        switch (this.options.context) {
          case 'info':
            prefix = 'Info';
            break;
          case 'success':
            prefix = 'Success';
            break;
          case 'danger':
            prefix = 'Danger';
            break;
          case 'warning':
            prefix = 'Warning';
            break;
          default:
            prefix = 'Info';
            break;
        }
        this.options.prefix = prefix;
      }

      if (this.options.animation === 'slidefade') {
        this.options.distance = parseInt(this.options.distance, 10) || 10;
      }

      /*
       * Check if target element already has an active tooltip
       * and if so, remove it unless it is set to interrupt.
       */
      var currentTooltip = this.options.$el.data('activeTooltip');
      if (currentTooltip) {
        if (currentTooltip.options.interrupt) {
          return;
        }
        currentTooltip.destroy();
      }

      /*
       * Save reference to this active tooltip to
       * jQuery target element.
       */
      this.options.$el.data('activeTooltip', this);

      // give Tooltip ID if provided
      this.id = this.options.id || null;

      this.elemWidth = this.options.$el.outerWidth();
      this.elemHeight = this.options.$el.outerHeight();

      // Set rootElem to body if not specified
      this.options.rootElem = this.options.rootElem || $('body');

      this.render();

      if (this.options.trigger) {
        /*
         * If custom trigger event provided
         * listen for this and show when fired
         * Bind 'this' to tooltip instance rather than
         * default jQuery element.
         */
        this.enterHandler = _.bind(this.show, this);
        this.options.$el.on(this.options.trigger, this.enterHandler);
      } else {
        /*
         * If no trigger event provided then assume trigger
         * event already fired in parent Backbone View so
         * call show() method. (default behaviour)
         */
        this.show();
      }

      if (this.options.exit) {
        /*
         * If exit event provided, save reference
         * of bound hide method. Doesn't actually
         * listen for this event until show() method
         * is fired.
         */
        this.exitHandler = _.bind(this.hide, this);
      } else {
        // Add default exit listener if none provided.
        this.addDefaultExitListeners();
      }

      // Remove other tooltips if set to interrupt
      if (this.options.interrupt) {
        this.interruptTooltips();
      }
    },
    interruptTooltips: function() {
      var self = this,
        elems = $('*').filter(function() {
          return $(this).data('activeTooltip') !== undefined && $(this).get(0) !== self.options.$el.get(0);
        });
      /* 
       * elems is a jQuery reference to all
       * elements on page with an active tooltip
       * except the current target element.
       */
      elems.each(function(i, item) {
        // Reference to tooltip stored in element data()
        var tooltip = $(item).data('activeTooltip');
        if (tooltip) {
          if (tooltip.options.exit) {
            if (tooltip.$el.is(':visible')) {
              /* 
               * If tooltip has custom exit event
               * and is visible, hide it, else do
               * nothing as already hidden.
               */
              tooltip.hide(true);
            }
          } else {
            // remove tootlip;
            tooltip.destroy();
          }
        }
      });
    },
    parseDataAttributes: function($el) {
      /*
       * allowed data-attributes will be
       * set to the options hash, others
       * will be ignored. Any missing
       * will be set to undefined.
       */
      var ops = {};
      ops.$el = $el;
      ops.text = $el.attr('data-bbtooltip');
      ops.align = $el.attr('data-bbtooltip-align');
      ops.id = $el.attr('data-bbtooltip-id');
      ops.context = $el.attr('data-bbtooltip-context');
      ops.timeout = $el.attr('data-bbtooltip-timeout');
      ops.interrupt = $el.attr('data-bbtooltip-interrupt');
      ops.trigger = $el.attr('data-bbtooltip-trigger');
      ops.exit = $el.attr('data-bbtooltip-exit');
      ops.feedback = $el.attr('data-bbtooltip-feedback');
      ops.speed = $el.attr('data-bbtooltip-speed');
      ops.animation = $el.attr('data-bbtooltip-animation');
      ops.distance = $el.attr('data-bbtooltip-distance');
      ops.prefix = $el.attr('data-bbtooltip-prefix');
      return ops;
    },
    events: {
      'click button.tooltip-confirm': 'confirmTooltip',
      'click button.tooltip-deny': 'denyTooltip'
    },
    confirmTooltip: function() {
      /*
       * Parent view can listen for
       * 'confirmed' event. tooltip instance is
       * passed for convenience.
       */
      this.trigger('confirmed', this);
      return false;
    },
    denyTooltip: function() {
      // check for custom exit event listeners
      if (this.options.exit) {
        return this.hide();
      }
      return this.exit();
    },
    show: function() {
      this.animate(true);
      if (this.options.trigger) {
        /*
         * unbinding and rebinding allows for
         * same event to be used for show and hide
         */
        this.options.$el.off(this.options.trigger, this.enterHandler);
      }
      if (this.options.exit) {
        this.options.$el.on(this.options.exit, this.exitHandler);
      }
    },
    hide: function(instant) {
      //if interrupted, tooltip should disppear instantly.
      if (instant === true) {
        this.$el.hide();
      } else {
        this.animate(false, function(){
          this.$el.hide();
        });
      }
      if (this.options.trigger) {
        /*
         * unbinding and rebinding allows for
         * same event to be used for show and hide
         */
        this.options.$el.on(this.options.trigger, this.enterHandler);
      }
      if (this.options.exit) {
        this.options.$el.off(this.options.exit, this.exitHandler);
      }
    },
    animate: function(enter, callback) {
      /*
       * enter - is this an entry animation?
       * callback - function to call when animation complete.
       */
      callback = callback || function() {};
      var boundCallback = _.bind(callback, this);

      //stop any current animations
      this.$el.stop();

      switch (this.options.animation) {
        //default animation is fade
        case 'fade':
          if (enter) {
            return this.$el.fadeIn(this.options.speed, boundCallback);
          }
          return this.$el.fadeOut(this.options.speed, boundCallback);

        case 'slide':
          // if aligned top or bottom, slideUp and slideDown will work fine.
          if (this.options.align === 'top' || this.options.align === 'bottom') {
            if (enter) {
              return this.$el.slideDown(this.options.speed, boundCallback);
            }
            return this.$el.slideUp(this.options.speed, boundCallback);
          }

          // if aligned right, change the css positioning from 'left' to 'right' anchored.
          if (this.options.align === 'right') {
            var right = this.options.rootElem.width() - (this.pos.left + this.width);
            this.$el.css({
              left: 'auto',
              right: right
            });
          }
          //animate width
          return this.$el.animate({
            width: 'toggle'
          }, this.options.speed, boundCallback);
        case 'slidefade':
          // start and end position objects
          var start = {}, end = {}, dist = this.options.distance; // default distance 10
          switch (this.options.align) {
            case 'top':
              start.top = this.pos.top - dist;
              end.top = this.pos.top;
              break;
            case 'bottom':
              start.top = this.pos.top + dist;
              end.top = this.pos.top;
              break;
            case 'left':
              start.left = this.pos.left - dist;
              end.left = this.pos.left;
              break;
            case 'right':
              start.left = this.pos.left + dist;
              end.left = this.pos.left;
              break;
            default:
              start.top = this.pos.top - dist;
              end.top = this.pos.top;
          }
          if (enter) {
            return this.$el.css(_.extend({
              display: 'block',
              opacity: 0
            }, start))
              .animate(_.extend({
                opacity: 1
              }, end), this.options.speed, boundCallback);
          }
          return this.$el.animate(_.extend({
            opacity: 0,
          }, start), this.options.speed, boundCallback);
      }
    },
    addDefaultExitListeners: function() {
      //save references so events can be removed from window on destroy
      this.clickHandler = _.bind(this.clicked, this);
      this.keypressHandler = _.bind(this.keypressed, this);
      $(window).on('click', this.clickHandler);
      $(window).on('keydown', this.keypressHandler);
    },
    clicked: function(e) {
      // check if the click event was on the target element or the tooltip object
      var isTargetElem = this.options.$el.get(0) === $(e.target).get(0) || this.options.$el.find($(e.target)).length > 0,
        isTooltip = $(e.target).hasClass('tooltip') || $(e.target).parents('.tooltip').length > 0 || false;
      if (!isTargetElem && !isTooltip && !this.options.feedback) {
        //remove if the click was elsewhere
        this.exit();
      }
    },
    keypressed: function(e) {
      // keyCode 9 = Tab
      if (e.keyCode === 9 && !this.options.feedback) {
        this.exit();
      }
    },
    render: function() {
      //using _.template to reduce number of dependencies
      var self = this,
        template = '<div class="arrow"></div>';
      template += '<div class="tooltip-text-wrapper"><span>';
      if(this.options.prefix){
        template += '<strong>' + this.options.prefix + ': </strong>';
      }
      template += '<%= options.text %>';
      template += '</span></div>';
      template += '<% if(options.feedback) { %>';
      template += '<div class="feedback-buttons">';
      template += '<button class="btn btn-primary tooltip-confirm">Yes</button> ';
      template += '<button class="btn btn-primary tooltip-deny">No</button>';
      template += '</div>';
      template += '<% } %>';
      this.$el.html(_.template(template)(this));

      if (this.options.feedback) {
        if (this.options.context && this.options.context !== 'info') {
          this.changeButtonClass();
        }
      }

      //append to root element - default $('body')
      this.options.rootElem.append(this.el);

      this.addClasses();
      this.getSize();
      this.positionSelf();
      this.getCssStyles();

      /*
       * save reference to bound resize event
       * so it can be removed from the window
       * when tooltip object is destroyed.
       */
      this.resizeHandler = _.bind(this.positionSelf, this);
      $(window).on('resize', this.resizeHandler);

      //set text wrapper to same size as element to prevent bunching of text when animating width
      $('div.tooltip-text-wrapper', this.el).outerWidth(this.width - (2 * this.padding) - 2 * this.borderWidth);


      if (this.options.timeout) {
        setTimeout(function() {
          self.exit();
        }, this.options.timeout);
      }
      return this;
    },
    changeButtonClass: function() {
      var cxt = this.options.context;
      if (cxt === 'warning' || cxt === 'danger') {
        $('.tooltip-confirm', this.el)
          .removeClass('btn-primary')
          .addClass('btn-danger');
      } else if (cxt === 'success') {
        $('.tooltip-confirm', this.el)
          .removeClass('btn-primary')
          .addClass('btn-success');
        $('.tooltip-deny', this.el)
          .removeClass('btn-primary')
          .addClass('btn-danger');
      }
    },
    getCssStyles: function() {
      this.borderWidth = parseInt(this.$el.css('border-width'), 10);
      this.padding = parseInt(this.$el.css('padding'), 10);
    },
    getSize: function() {
      /*
       * Show and hide element to gain access
       * to dimensions.
       */
      this.$el.show();
      this.width = this.$el.outerWidth();
      this.height = this.$el.outerHeight();
      this.$el.hide();
    },
    positionSelf: function() {
      //position tooltip correclty relative to target and parent root element.
      var rootElemOffset = this.options.rootElem.offset(),
        scrollTop = this.options.rootElem.prop('tagName') === 'BODY' ? 0 : this.options.rootElem.get(0).scrollTop,
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
      //save reference to position for use in animations
      this.pos = pos;
    },

    exit: function() {
      /*
       * wait until animation complete before
       * calling destroy();
       */
      this.animate(false, this.destroy);
    },

    destroy: function() {
      // Remove tooltip reference from $el data
      this.options.$el.data('activeTooltip', null);
      // Unbind window listeners relating to this tooltip
      $(window).off('click', this.clickHandler);
      $(window).off('keydown', this.keypressHandler);
      $(window).off('resize', this.resizeHandler);


      //Remove custom listeners if added.
      if (this.options.trigger) {
        this.options.$el.off(this.options.trigger, this.enterHandler);
      }
      if (this.options.exit) {
        this.options.$el.off(this.options.exit, this.exitHandler);
      }

      /*
       * Unbind events and remove from DOM
       */
      this.remove();
      this.unbind();
    },

    addClasses: function() {
      /*
       * Only allow defined classes to be
       * added to elem.
       */
      var context, align;
      switch (this.options.context) {
        case 'info':
          context = 'info';
          break;
        case 'success':
          context = 'success';
          break;
        case 'danger':
          context = 'danger';
          break;
        case 'warning':
          context = 'warning';
          break;
        default:
          context = 'info';
      }
      this.$el.addClass(context);

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
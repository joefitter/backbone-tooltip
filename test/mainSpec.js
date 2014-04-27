/*global describe,expect,it,beforeEach,afterEach*/

define([
  '../src/backbone-tooltip.amd.js'
], function(
  Tooltip
){
  'use strict';
  describe('Backbone Tooltip', function(){
    describe('Errors', function() {
      it('should throw an error if not provided with any element or options', function(){
        expect(function(){
          new Tooltip();
        }).toThrow(new Error('Tooltip needs to be provided with a jQuery element object or options hash'));
      });
      it('should throw an error if $el is not a jQuery element', function(){
        expect(function(){
          new Tooltip({$el: {}});
        }).toThrow(new Error('Tooltip needs a target element'));
      });
      it('should throw an error if no tooltip text is provided', function(){
        expect(function(){
          new Tooltip({$el: $('<div/>')});
        }).toThrow(new Error('Sorry, no tooltip text was provided.'));
      });
      it('shouldn\'t throw an error if instantiated with a jQuery element', function(){
        expect(function(){
          new Tooltip({$el: $('<div/>'), text: 'tooltip text'});
        }).not.toThrow();
      });
    });
    describe('Standard instantation', function(){
      var tooltip, classes;
      beforeEach(function(){
        var $el = $('<div></div>');
        tooltip = new Tooltip({$el: $el, text: 'tooltip text'});
        classes = tooltip.$el.attr('class').split(' ');
      });
      afterEach(function(){
        tooltip.destroy();
        tooltip = undefined;
        classes = undefined;
      });
      it('should have align-top class by default', function(){
        expect(classes).toContain('align-top');
      });
      it('shouldn\'t have a contextual class by default', function(){
        expect(classes).not.toContain('info');
        expect(classes).not.toContain('success');
        expect(classes).not.toContain('warning');
        expect(classes).not.toContain('error');
      });
      it('should contain the text "tooltip text"', function(){
        expect(tooltip.$el.text()).toBe('tooltip text');
      });
      it('should be visible', function(){
        expect(tooltip.$el.is(':visible')).toBe(true);
      });
      it('should be animating', function(){
        expect(tooltip.$el.is(':animated')).toBe(true);
      });
    });
  });
});
/*global describe,expect,it,beforeEach,afterEach,spyOn,jasmine*/

define([
  '../src/backbone-tooltip.amd.js'
], function(
  Tooltip
) {
  'use strict';
  describe('Backbone Tooltip', function() {
    describe('Errors', function() {
      it('should throw an error if not provided with any element or options', function() {
        expect(function() {
          new Tooltip();
        }).toThrow(new Error('Tooltip needs to be provided with a jQuery element object or options hash'));
      });
      it('should throw an error if $el is not a jQuery element', function() {
        expect(function() {
          new Tooltip({
            $el: {}
          });
        }).toThrow(new Error('Tooltip needs a target element'));
      });
      it('should throw an error if no tooltip text is provided', function() {
        expect(function() {
          new Tooltip({
            $el: $('<div/>')
          });
        }).toThrow(new Error('Sorry, no tooltip text was provided.'));
      });
      it('should throw an error if given a timeout and requires feedback', function() {
        expect(function() {
          new Tooltip({
            $el: $('<div/>'),
            text: 'test',
            feedback: true,
            timeout: 2000
          });
        }).toThrow(new Error('Sorry, cannot timeout tooltip while awaiting feedback'));
      });
      it('shouldn\'t throw an error if instantiated with a jQuery element', function() {
        expect(function() {
          new Tooltip({
            $el: $('<div/>'),
            text: 'tooltip text'
          });
        }).not.toThrow();
      });
    });
    describe('Standard instantation', function() {
      var $el = $('<div/>', {
        style: 'width: 10px; height:10px;'
      }),
        tooltip, classes;
      describe('check defaults options', function() {
        beforeEach(function() {
          tooltip = new Tooltip({
            $el: $el,
            text: 'tooltip text'
          });
          classes = tooltip.$el.attr('class').split(' ');
        });
        afterEach(function() {
          tooltip.destroy();
          tooltip = null;
          classes = null;
        });
        it('should have a reference to the empty div passed in', function() {
          expect(tooltip.options.$el).toEqual($el);
        });
        it('should set the root element to body by default', function() {
          expect(tooltip.options.rootElem.prop('tagName')).toBe('BODY');
        });
        it('should have align-top class by default', function() {
          expect(classes).toContain('align-top');
        });
        it('should have info contextual class by default', function() {
          expect(classes).toContain('info');
          expect(classes).not.toContain('success');
          expect(classes).not.toContain('warning');
          expect(classes).not.toContain('danger');
        });
        it('should have a speed of 200 by default', function() {
          expect(tooltip.options.speed).toBe(200);
        });
        it('should set animation to fade by default', function() {
          expect(tooltip.options.animation).toBe('fade');
        });
        it('should contain the text "tooltip text"', function() {
          expect(tooltip.$el.text()).toBe('Info: tooltip text');
        });
        it('should be visible', function() {
          expect(tooltip.$el.is(':visible')).toBe(true);
        });
        it('should be animating', function() {
          expect(tooltip.$el.is(':animated')).toBe(true);
        });
      });
      describe('check options set', function() {
        beforeEach(function() {
          tooltip = new Tooltip({
            $el: $el,
            text: 'something went wrong',
            align: 'bottom',
            context: 'danger',
            timeout: 3000,
            speed: 100,
            animation: 'slide',
            id: 'tooltip-id'
          });
          classes = tooltip.$el.attr('class').split(' ');
        });
        afterEach(function() {
          tooltip.destroy();
          tooltip = null;
          classes = null;
        });
        it('should pass the id through to the tooltip element', function() {
          expect(tooltip.$el.attr('id')).toBe('tooltip-id');
        });
        it('should have "align-bottom" as a class', function() {
          expect(classes).toContain('align-bottom');
        });
        it('should have "danger" as a class', function() {
          expect(classes).toContain('danger');
        });
        it('should have a timout of 3000 (int)', function() {
          expect(tooltip.options.timeout).toBe(3000);
        });
        it('should animate with a speed of 100 (int)', function() {
          expect(tooltip.options.speed).toBe(100);
        });
        it('should use slide animation', function() {
          expect(tooltip.options.animation).toBe('slide');
        });
      });
      describe('check custom triggers', function() {
        beforeEach(function() {
          tooltip = new Tooltip({
            $el: $el,
            text: 'text',
            trigger: 'click',
            exit: 'click'
          });
          spyOn(tooltip, 'show');
        });
        afterEach(function() {
          tooltip.destroy();
          tooltip = null;
        });
        it('shouldn\'t be visible initially', function() {
          expect(tooltip.$el.is(':visible')).toBe(false);
          expect(tooltip.show).not.toHaveBeenCalled();
        });
        it('should have added a click listener to target element', function() {
          expect($._data($el[0], 'events').hasOwnProperty('click')).toBe(true);
        });
        it('should remove custom listeners on destroy', function() {
          tooltip.destroy();
          expect($._data($el[0], 'events')).toBeUndefined();
        });
      });
    });
    describe('Data attribute instantiation', function() {
      var $el, tooltip, classes, watcher;
      beforeEach(function() {
        $el = $('<div/>', {
          'data-bbtooltip': 'tooltip text',
          'data-bbtooltip-context': 'warning',
          'data-bbtooltip-speed': '400',
          'data-bbtooltip-feedback': true,
          'data-bbtooltip-align': 'left',
          'data-bbtooltip-id': 'data-attributes'
        });
        tooltip = new Tooltip($el);
        watcher = jasmine.createSpy('watcher');
        classes = tooltip.$el.attr('class').split(' ');
      });
      afterEach(function() {
        tooltip.destroy();
        tooltip = null;
        $el = null;
        classes = null;
      });
      it('should contain the correct text', function() {
        expect(tooltip.$el.find('span').text()).toBe('Warning: tooltip text');
      });
      it('should contain the "align-left" class', function() {
        expect(classes).toContain('align-left');
      });
      it('should contain the "warning" class', function() {
        expect(classes).toContain('warning');
      });
      it('should have an id of "data-attributes"', function() {
        expect(tooltip.id).toBe('data-attributes');
      });
      it('should fire the "confirmed" event on click of "Yes" button', function() {
        tooltip.on('confirmed', function() {
          watcher();
        });
        expect(watcher).not.toHaveBeenCalled();
        tooltip.$el.find('button.tooltip-confirm').click();
        expect(watcher).toHaveBeenCalled();
      });
    });
  });
});
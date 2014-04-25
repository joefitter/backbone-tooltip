/*global describe,expect,it*/

define([
  '../src/backbone-tooltip.amd.js'
], function(
  Tooltip
){
  'use strict';

  describe('Tooltip errors', function() {
    it('should throw an error if not provided with any element or options', function(){
      expect(function(){
        new Tooltip();
      }).toThrow(new Error('Tooltip need to be provided with a jQuery element object or options hash'));
    });
    it('should throw an error if $el is not a jQuery element', function(){
      expect(function(){
        new Tooltip({$el: {}});
      }).toThrow(new Error('Tooltip needs a target element'));
    });
  });
});
define([
  'jquery',
  'underscore'
], function(
  $,
  _
){
  'use strict';

  describe('just checking', function() {
    it('works for underscore', function(){
      expect(true).toBe(true);
      expect(_.size([1,2,3])).toEqual(3);
    })
  })
});
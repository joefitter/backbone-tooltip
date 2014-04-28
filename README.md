# Backbone Tooltip [![Build Status](https://travis-ci.org/joefitter/backbone-tooltip.svg?branch=master)](https://travis-ci.org/joefitter/backbone-tooltip)
> Lightweight Bootstrap-esque tooltip that doesn't require Bootstrap

Backbone Tooltip is a fully customisable plugin for use in web applications. It is written in BackboneJS but can be used in any front end environment. 

## Prerequisites
Backbone Tooltip requires:
* [jQuery](http://jquery.com/) >= v1.9.0
* [Backbone](http://backbonejs.org) >= v0.9.0

Note: Backbone requires either [Underscore](http://underscorejs.org/) or [Lo-Dash](http://lodash.com/) so you will need to also include one of these manually if you are not installing with Bower.

## Get Backbone Tooltip
Backbone Tooltip can be installed using [Bower](http://bower.io/)

    $ bower install backbone-tooltip

You can clone the GitHub repository

    $ git clone https://github.com/joefitter/backbone-tooltip

## Installation
You will need to include the stylesheet in the `<head>` of every page the tooltip will be used on:

    <link rel="stylesheet" href="bower_components/backbone-tooltip/src/backbone-tooltip.css">

### AMD
If your project uses [RequireJS](http://requirejs.org/), Backbone Tooltip can be included as an AMD module by adding the AMD version to your paths config, you will also need to specify the locations of jQuery, Backbone and Underscore:

    requirejs.config({
      paths: {
        tooltip: 'bower_components/backbone-tooltip/src/backbone-tooltip.amd',
        backbone: 'bower_components/backbone/backbone',
        jquery: 'bower_components/jquery/dist/jquery',
        underscore: 'bower_components/underscore/underscore'
        ...
      }
    });

You can now use require to include the tooltip whenever it is needed:

    require(['tooltip'], function(Tooltip){
      ...
    });

    define('module-name', ['tooltip', ...], function(Tooltip, ...){
      ...
    });

### Non-AMD
For non-AMD projects, include the following scripts before the closing `<head>` tag

    <script src="bower_components/jquery/dist/jquery.js"></script>
    <script src="bower_components/underscore/underscore.js"></script>
    <script src="bower_components/backbone/backbone.js"></script>
    <script src="bower_components/backbone-tooltip/src/backbone-tooltip.js"></script>

Alter the paths above so they point to the correct locations in your file structure.

If you use the non-AMD version, the tooltip is instantiated by creating a `new Backbone.Tooltip();`

## Usage
A Backbone Tooltip can be instantiated by either passing an options hash or a jQuery element. If you use an options hash a jQuery element must be passed as the `$el` or an error will be thrown.

By default, the tooltip will be shown as soon as it is instantiated and destroyed once an element other than the target element or the tooltip is clicked, or the tab button pressed. If you use the tooltip in this way, you will need to create an event listener which creates a `new Tooltip(options);` when fired:

    $(element).on('focus', function(){
      new Tooltip({
        $el: $jQueryObject,
        text: 'This is the text that is displayed in the tooltip',
        align: 'top',
        context: 'info'
      });

      //or

      new Tooltip($jqueryObject);      
    });

### Custom Triggers
To use custom triggers rather than Backbone events, instantiate a `new Tooltip()` for each tooltip element when the element is rendered and pass the options `trigger: 'click|mouseenter|...` and `exit: 'click|mouseleave|...`:

    $(function(){
      $('element.tooltip').each(function(){
        new Tooltip({
          $el: $(this);
          text: 'This tooltip has custom listeners',
          trigger: 'click',
          exit: 'click'
        });
      });
    });

## Options
### Options hash
The Backbone Tooltip can be instantiated by passing an options hash `new Tooltip(options)` The following options are supported

    {
      $el: (jQuery element) element, // required
      text: (String) message, // default ''
      rootElem: (jQuery element) element, // default $('body')
      align: 'top|bottom|left|right', // default 'top'
      context: 'info|success|warning|danger', // default ''
      timeout: (Integer) milliseconds, // default undefined
      interrupt: (Boolean) interrupt, // default undefined
      trigger: (String) event, // default undefined
      exit: (String) event, // default undefined
      speed: (Integer) milliseconds, // default 200
      feedback: (Boolean) requireFeedback, // default undefined
      animation: (String) 'fade|slide|slidefade', // default 'fade'
      id: (String) id, // default undefined
      prefix: (String) prefixTheMessage, // default 'Info|Success|Warning|Danger' depending on context
      distance: (Integer) 50 // default 10 - distance to animate (only slidefade)
    }

### Data-Attributes
Options can be configured on each element using `HTML5` data-attributes. The following data-attributes are supported

    <a href="#"
      data-tooltip="This is the tooltip text"
      data-align="top"
      data-context="danger"
      data-timeout="3000"
      data-interrupt="true"
      data-trigger="click"
      data-exit="click"
      data-speed="200"
      data-prefix="Oops"
      data-distance="50"
      data-animation="slidefade"
      data-feedback="true">Click Me</a>

## Examples
You can see a variety of working examples by visiting the [project page](http://joefitter.github.io/backbone-tooltip/).
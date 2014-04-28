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

```bash
$ bower install backbone-tooltip
```

You can clone the GitHub repository

```bash
$ git clone https://github.com/joefitter/backbone-tooltip
```

Or you can download the repo as a .zip [here](https://github.com/joefitter/backbone-tooltip/archive/master.zip) - extract and copy the src folder into your project.

## Installation
You will need to include the stylesheet in the `<head>` of every page the tooltip will be used on:

```html
<link rel="stylesheet" href="bower_components/backbone-tooltip/src/backbone-tooltip.css">
```

#### AMD
If your project uses [RequireJS](http://requirejs.org/), Backbone Tooltip can be included as an AMD module by adding the AMD version to your paths config, you will also need to specify the locations of jQuery, Backbone and Underscore:

```js
requirejs.config({
  paths: {
    tooltip: 'bower_components/backbone-tooltip/src/backbone-tooltip.amd',
    backbone: 'bower_components/backbone/backbone',
    jquery: 'bower_components/jquery/dist/jquery',
    underscore: 'bower_components/underscore/underscore'
    ...
  }
});
```

You can now use require to include the tooltip whenever it is needed:

```js
require(['tooltip'], function(Tooltip){
  ...
});

define('module-name', ['tooltip', ...], function(Tooltip, ...){
  ...
});
```

#### Non-AMD
For non-AMD projects, include the following scripts before the closing `<head>` tag

```html
<script src="bower_components/jquery/dist/jquery.js"></script>
<script src="bower_components/underscore/underscore.js"></script>
<script src="bower_components/backbone/backbone.js"></script>
<script src="bower_components/backbone-tooltip/src/backbone-tooltip.js"></script>
```

Alter the paths above so they point to the correct locations in your file structure.

If you use the non-AMD version, the tooltip is instantiated by creating a `new Backbone.Tooltip();`

## TL;DR
Add the `data-bbtooltip` attribute to any element that requires a tooltp:

```html
<a href="#" data-bbtooltip="I am a tooltip">Click Me</a>
```

Register the event handlers and create a new Tooltip instance:

```js
$('[data-bbtooltip]').each(function(){
  var $this = $(this);
  $this.on('click', function(){
    new Tooltip($this);
    //non AMD - new Backbone.Tooltip($this);
  });
});
```

A full list of options that can be passed with `data-attributes` can be seen below.

## Usage
A Backbone Tooltip can be instantiated by either passing an options hash or a jQuery element. If you use an options hash a jQuery element must be passed as the `$el` or an error will be thrown.

By default, the tooltip will be shown as soon as it is instantiated and destroyed once an element other than the target element or the tooltip is clicked, or the tab button pressed. If you use the tooltip in this way, you will need to create an event listener which creates a `new Tooltip(options);` when fired:

```js
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
```

#### Custom Triggers
To use custom triggers rather than Backbone events, instantiate a `new Tooltip()` for each tooltip element when the element is rendered and pass the options `trigger: 'click|mouseenter|...` and `exit: 'click|mouseleave|...`:

```js
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
```

## Options
#### Options hash
The Backbone Tooltip can be instantiated by passing an options hash `new Tooltip(options)` The following options are supported

```js
{
  $el: (jQuery Object) element, // required
  text: (String) message, // default ''
  rootElem: (jQuery Object) element, // default $('body')
  align: (String) 'top|bottom|left|right', // default 'top'
  context: (String)'info|success|warning|danger', // default ''
  timeout: (Number) milliseconds, // default undefined
  interrupt: (Boolean) interrupt, // default undefined
  trigger: (String) event, // default undefined
  exit: (String) event, // default undefined
  speed: (Number) milliseconds, // default 200
  feedback: (Boolean) requireFeedback, // default undefined
  animation: (String) 'fade|slide|slidefade', // default 'fade'
  id: (String) id, // default undefined
  prefix: (String) prefixTheMessage, // default 'Info|Success|Warning|Danger' depending on context
  distance: (Number) 50 // default 10 - distance to animate (only slidefade)
}
```

#### Data-Attributes
Options can be configured on each element using `HTML5` data-attributes. The following data-attributes are supported

```html
<a href="#"
  data-bbtooltip="This is the tooltip text"
  data-bbtooltip-align="top"
  data-bbtooltip-context="danger"
  data-bbtooltip-timeout="3000"
  data-bbtooltip-interrupt="true"
  data-bbtooltip-trigger="click"
  data-bbtooltip-exit="click"
  data-bbtooltip-speed="200"
  data-bbtooltip-prefix="Oops"
  data-bbtooltip-distance="50"
  data-bbtooltip-animation="slidefade"
  data-bbtooltip-feedback="true">Click Me</a>
```

## Examples
You can see a variety of working examples by visiting the [project page](http://joefitter.github.io/backbone-tooltip/).
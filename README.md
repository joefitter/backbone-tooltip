# Backbone Tooltip
[![Build Status](https://travis-ci.org/joefitter/backbone-tooltip.svg?branch=master)](https://travis-ci.org/joefitter/backbone-tooltip)

Backbone Tooltip is a plugin for use in web applications. It is written in BackboneJS but can be used in any front end environment. 

## Prerequisites
Backbone Tooltip requires:
* [jQuery](http://jquery.com/)
* [Backbone](http://backbonejs.org)
* [Underscore](http://underscorejs.org/) (can be replaced with lodash)

## Installation
Backbone Tooltip can be installed using [Bower](http://bower.io/)

    $ bower install backbone-tooltip

You can clone the GitHub repository

    $ git clone https://github.com/joefitter/backbone-tooltip

## Usage
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

### Non-AMD
For non-AMD projects, include the following scripts before the closing `<head>` tag

    <script src="bower_components/jquery/dist/jquery.js"></script>
    <script src="bower_components/underscore/underscore.js"></script>
    <script src="bower_components/backbone/backbone.js"></script>
    <script src="bower_components/backbone-tooltip/src/backbone-tooltip.js"></script>

Alter the paths above if different in your file structure.




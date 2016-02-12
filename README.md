# grunt-domly v0.0.6 [![Build Status: Linux](https://travis-ci.org/lazd/grunt-domly.svg?branch=master)](https://travis-ci.org/lazd/grunt-domly)

> Precompile DOMly templates



## Getting Started
This plugin requires Grunt `^0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-domly --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-domly');
```




## DOMly task
_Run this task with the `grunt domly` command._

Task targets, files and options may be specified according to the grunt [Configuring tasks](http://gruntjs.com/configuring-tasks) guide.
### Options

#### namespace
Type: `String` or `false` or `function`  
Default: `'templates'`

The namespace in which the precompiled templates will be assigned.  *Use dot notation (e.g. App.Templates) for nested namespaces or false for no namespace wrapping.*  When false with `amd` option set `true`, templates will be returned directly from the AMD wrapper.

Example:
```js
options: {
  namespace: 'MyApp.Templates'
}
```

You can generate nested namespaces based on the file system paths of your templates by providing a function. The function will be called with one argument (the template filepath).  *The function must return a dot notation based on the filepath*.

Example:
```js
options: {
  namespace: function(filename) {
    var names = filename.replace(/modules\/(.*)(\/\w+\.html)/, '$1');
    return names.split('/').join('.');
  },
  files: {
    'ns_nested_tmpls.js' : [ 'modules/**/*.html']
  }
}
```

#### root
Type: `String`  
Default: `'this'`

The name of the object in which template namespaces will be declared. By default, `nsdeclare` will declare namespaces within the `this` object (which defaults to `window` in browser environments), but you can change it here if necessary.

#### amd
Type: `Boolean`  
Default: `false`

Wraps the output file with an AMD define function and returns the compiled template namespace unless namespace has been explicitly set to false in which case the template function will be returned directly.

```js
define(function() {
    //...//
    return this['[template namespace]'];
});
```

#### commonjs
Type: `Boolean`  
Default: `false`

Wraps the output file in a CommonJS module function, exporting the compiled templates. It will also add templates to the template namespace, unless `namespace` is explicitly set to `false`.

```js
module.exports = function(DOMly) {
    //...//
    DOMly.template(…);
    return this['[template namespace]'];
};
```

#### processName
Type: `function`

This option accepts a function which takes one argument (the template filepath) and returns a string which will be used as the key for the precompiled template object.  The example below stores all templates in the `TEMPLATES` namespace in capital letters.

```js
options: {
  namespace: 'TEMPLATES',
  processName: function(filePath) {
    return filePath.toUpperCase();
  }
}
```

#### separator
Type: `String`

Default: `linefeed + linefeed`

Concatenated files will be joined on this string.

#### compilerOptions
Type `Object`  
Default: `{}`

This option allows you to specify a hash of options which will be passed directly to the DOMly compiler.

``` javascript
options: {
  compilerOptions: {
    stripWhitespace: true
  }
}
```
### Usage Examples

Compile all the templates in `source/templates/` to `App.templates` using the filename (minus the extension as the template name), storing the output in `dist/templates.js`.

```js
domly: {
  compile: {
    options: {
      namespace: 'App.templates'
    },
    files: {
      'dist/templates.js': 'source/templates/*.html'
    }
  }
}
```

## Release History

 * 2015-03-06   v0.0.6   Update DOMly version to 0.0.8
 * 2014-06-19   v0.0.5   Update DOMly version to 0.0.6
 * 2014-06-17   v0.0.4   Update DOMly version to 0.0.5
 * 2014-06-17   v0.0.3   Update DOMly version to 0.0.4
 * 2014-06-17   v0.0.2   Update DOMly version to 0.0.3
 * 2014-06-16   v0.0.1   Use nsdeclare instead of grunt-lib-contrib, closes
 * 2014-02-24   v0.0.0   Initial release.

---

Task submitted by [Larry Davis](http://lazd.net/)

*This file was generated on Fri Mar 06 2015 13:20:40.*

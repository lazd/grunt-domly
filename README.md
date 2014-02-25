# grunt-domly [![NPM version][npm-image]][npm-url] [![Build status][travis-image]][travis-url]
> Precompile DOMly templates

## Usage

First, install `grunt-domly` as a development dependency:

```shell
npm install grunt-domly --save-dev
```

Then, enable it in your Gruntfile:

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

[travis-url]: http://travis-ci.org/lazd/grunt-domly
[travis-image]: https://secure.travis-ci.org/lazd/grunt-domly.png?branch=master
[npm-url]: https://npmjs.org/package/grunt-domly
[npm-image]: https://badge.fury.io/js/grunt-domly.png

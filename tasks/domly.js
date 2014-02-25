'use strict';

var path = require('path');
var precompile = require('domly').precompile;
var chalk = require('chalk');

module.exports = function(grunt) {
  var _ = grunt.util._;
  var helpers = require('grunt-lib-contrib').init(grunt);

  grunt.registerMultiTask('domly', 'Precompile DOMly templates', function() {

    var options = this.options({
      namespace: 'templates',
      separator: grunt.util.linefeed + grunt.util.linefeed,
      amd: false,
      commonjs: false,
      processName: function(filepath) { return path.basename(filepath, '.html'); }
    });

    var nsInfo;
    if (options.namespace !== false) {
      nsInfo = helpers.getNamespaceDeclaration(options.namespace);
    }

    var useNamespace = options.namespace !== false;

    var namespaceInfo = _.memoize(function(filepath) {
      if (!useNamespace) {return undefined;}
      if (_.isFunction(options.namespace)) {
        return helpers.getNamespaceDeclaration(options.namespace(filepath));
      } else {
        return helpers.getNamespaceDeclaration(options.namespace);
      }
    });

    var processName = options.processName;

    var nsDeclarations = [];

    this.files.forEach(function(file) {
      var templates = [];
      var nsInfo;
      var templateName;

      var contents = file.src.filter(function(filepath) {
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        }
        return true;
      }).map(function(filepath) {
        // Read file
        var contents = grunt.file.read(filepath);

        nsInfo = namespaceInfo(filepath);
        if (nsInfo) {
          // save a map of declarations so we can put them at the top of the file later
          nsDeclarations.push(nsInfo.declaration);
        }

        // Compile
        var compiled;
        try {
          compiled = precompile(contents, options);
        }
        catch (e) {
          grunt.log.error(e);
          grunt.fail.warn('DOMly failed to compile '+filepath+'.');
        }
     
        templateName = processName(filepath);

        if(options.amd && !useNamespace) {
          compiled = 'return ' + compiled;
        }
        if (useNamespace) {
          templates.push(nsInfo.namespace+'['+JSON.stringify(templateName)+'] = '+compiled+';');
        }
        else if (options.commonjs === true) {
          templates.push('templates['+JSON.stringify(templateName)+'] = '+compiled+';');
        }
        else {
          templates.push(compiled);
        }
      }).join('\n');

      if (templates.length < 1) {
        grunt.log.warn('Destination not written because compiled files were empty.');
      }
      else {
        if (useNamespace) {
          var declarations = nsDeclarations.join(options.separator);
          templates.unshift(declarations);
        }

        if (options.amd) {
          // Wrap the file in an AMD define fn.
          templates.unshift('define(function() {');
          if (useNamespace) {
            // Namespace has not been explicitly set to false; the AMD
            // wrapper will return the object containing the template.
            templates.push('return '+nsInfo.namespace+';');
          }
          templates.push('});');
        }

        if (options.commonjs) {
          if (useNamespace) {
            templates.push('return '+nsInfo.namespace+';');
          }
          else {
            templates.unshift('var templates = {};');
            templates.push('return templates;');
          }
          // Export the templates object for CommonJS environments.
          templates.unshift('module.exports = function() {');
          templates.push('};');
        }

        grunt.file.write(file.dest, templates.join(grunt.util.normalizelf(options.separator)));
        grunt.log.writeln('File ' + chalk.cyan(file.dest) + ' created.');
      }
    });
  });
};

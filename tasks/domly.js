'use strict';

var path = require('path');
var precompile = require('domly').precompile;
var chalk = require('chalk');
var nsdeclare = require('nsdeclare');

module.exports = function(grunt) {
  var _ = grunt.util._;

  grunt.registerMultiTask('domly', 'Precompile DOMly templates', function() {

    var options = this.options({
      namespace: 'templates',
      separator: grunt.util.linefeed + grunt.util.linefeed,
      amd: false,
      commonjs: false,
      processName: function(filePath) { return path.basename(filePath, '.html'); }
    });

    // Check if we're using namespaces
    var useNamespace = options.namespace !== false;

    var processName = options.processName;

    this.files.forEach(function(file) {
      var templates = [];
      var nsInfo;
      var templateName;

      // Track which namespace parts have been declared
      var declaredNamespaces = {};

      var declareNamespaceAndStoreTemplate = function(filePath, templateName, value) {
        if (!useNamespace) { return undefined; }

        var templateWithDeclaration;
        if (_.isFunction(options.namespace)) {
          templateWithDeclaration = nsdeclare(options.namespace(filePath)+'.'+templateName, { declared: declaredNamespaces, value: value, root: options.root });
        }
        else {
          templateWithDeclaration = nsdeclare(options.namespace+'.'+templateName, { declared: declaredNamespaces, value: value, root: options.root });
        }

        templates.push(templateWithDeclaration);
      };

      var contents = file.src.filter(function(filePath) {
        if (!grunt.file.exists(filePath)) {
          grunt.log.warn('Source file "' + filePath + '" not found.');
          return false;
        }
        return true;
      }).map(function(filePath) {
        // Read file
        var contents = grunt.file.read(filePath);

        // Compile
        var compiled;
        try {
          compiled = precompile(contents, options);
        }
        catch (e) {
          grunt.log.error(e);
          grunt.fail.warn('DOMly failed to compile '+filePath+'.');
        }

        templateName = processName(filePath);

        if(options.amd && !useNamespace) {
          compiled = 'return ' + compiled;
        }
        if (useNamespace) {
          declareNamespaceAndStoreTemplate(filePath, templateName, compiled);
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
        if (options.amd) {
          // Wrap the file in an AMD define fn.
          templates.unshift('define(function() {');
          if (useNamespace) {
            // Namespace has not been explicitly set to false; the AMD
            // wrapper will return the object containing the template.
            templates.push('return this['+JSON.stringify(options.namespace)+'];');
          }
          templates.push('});');
        }

        if (options.commonjs) {
          if (useNamespace) {
            templates.push('return templates['+JSON.stringify(options.namespace)+'];');
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

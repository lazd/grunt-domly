var path = require('path');
var precompile = require('atml').precompile;
var chalk = require('chalk');

'use strict';

module.exports = function(grunt) {
  var _ = grunt.util._;
  var helpers = require('grunt-lib-contrib').init(grunt);

  grunt.registerMultiTask('atml', 'Precompile ATML templates', function() {

    var options = this.options({
      namespace: 'templates',
      separator: grunt.util.linefeed + grunt.util.linefeed,
      amd: false,
      commonjs: false,
      processName: function(filepath) { return path.basename(filepath, '.html'); }
    });

    var useNamespace = options.namespace !== false;

    var processName = options.processName;

    var nsDeclarations = [];

    this.files.forEach(function(file) {
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
          grunt.fail.warn('ATML failed to compile '+filepath+'.');
        }
     
        templateName = processName(filepath);

        if(options.amd && !useNamespace) {
          compiled = 'return ' + compiled;
        }
        if (useNamespace) {
          templates.push(nsInfo.namespace+'['+JSON.stringify(templateName)+'] = '+compiled+';');
        }
        else if (options.commonjs === true) {
          templates.push('templates['+JSON.stringify(filename)+'] = '+compiled+';');
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
          output.unshift(declarations);

          if (options.node) {
            output.unshift('var glob = (\'undefined\' === typeof window) ? global : window,');

            var nodeExport = 'if (typeof exports === \'object\' && exports) {';
            nodeExport += 'module.exports = ' + nsInfo.namespace + ';}';

            output.push(nodeExport);
          }

        }

        if (options.amd) {
          // Wrap the file in an AMD define fn.
          output.unshift('define(function() {');
          if (useNamespace) {
            // Namespace has not been explicitly set to false; the AMD
            // wrapper will return the object containing the template.
            output.push('return '+nsInfo.namespace+';');
          }
          output.push('});');
        }

        if (options.commonjs) {
          if (useNamespace) {
            output.push('return '+nsInfo.namespace+';');
          }
          else {
            output.unshift('var templates = {};');
            output.push('return templates;');
          }
          // Export the templates object for CommonJS environments.
          output.unshift('module.exports = function() {');
          output.push('};');
        }

        grunt.file.write(f.dest, output.join(grunt.util.normalizelf(options.separator)));
        grunt.log.writeln('File ' + chalk.cyan(f.dest) + ' created.');
      }
    });
  });
};

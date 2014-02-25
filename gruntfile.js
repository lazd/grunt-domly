/*
 * grunt-contrib-handlebars
 * http://gruntjs.com/
 *
 * Original work Copyright (c) 2013 Larry Davis, contributors
 * Modified work Copyright (c) 2013 Tim Branyen, contributors
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Configuration to be run (and then tested).
    domly: {
      compile: {
        files: {
          'tmp/Basic.js': ['test/fixtures/Basic.html']
        }
      },
      compileAMD: {
        options: {
          namespace: 'JST',
          amd: true
        },
        files: {
          'tmp/Basic-AMD.js': ['test/fixtures/Basic.html']
        }
      },
      compileCommonJS: {
        options: {
          namespace: 'JST',
          commonjs: true
        },
        files: {
          'tmp/Basic-CommonJS.js': ['test/fixtures/Basic.html']
        }
      },
      processName: {
        options: {
          namespace: 'JST',
          processName: function() {
          	return 'NewName';
          }
        },
        files: {
          'tmp/Basic-processName.js': ['test/fixtures/Basic.html']
        }
      }
    },
    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }
  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-internal');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'domly', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test', 'build-contrib']);
};

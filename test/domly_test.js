'use strict';

var path = require('path');
var grunt = require('grunt');

// Helper for getting files without whitespace
function filesAreEqual(actual, expected, fn) {
  if (typeof expected === 'function') {
    fn = expected;
    expected = actual;
  }
  fn(
    String(grunt.file.read(path.join('tmp', actual))).replace(/\/\*\*\//g, '').replace(/\n/g, ''),
    String(grunt.file.read(path.join('test', 'expected', expected))).replace(/\n/g, '')
  );
}

exports.domly = {
  compile: function(test) {
    test.expect(1);

    filesAreEqual('Basic.js', function(actual, expected) {
      test.equal(actual, expected, 'should compile basic templates');
      test.done();
    });
  },
  amd: function(test) {
    test.expect(1);

    filesAreEqual('Basic-AMD.js', function(actual, expected) {
      test.equal(actual, expected, 'should compile basic templates as AMD modules');
      test.done();
    });
  },
  commonjs: function(test) {
    test.expect(1);

    filesAreEqual('Basic-AMD.js', function(actual, expected) {
      test.equal(actual, expected, 'should compile basic templates as CommonJS modules');
      test.done();
    });
  },
  processname: function(test) {
    test.expect(1);

    filesAreEqual('Basic-processName.js', function(actual, expected) {
      test.equal(actual, expected, 'should support processName');
      test.done();
    });
  }
};

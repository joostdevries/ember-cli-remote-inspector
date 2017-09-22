/* jshint node: true */
'use strict';

var RSVP           = require('rsvp');
var spawn          = require('child_process').spawn;

module.exports = function run(onOutput, onError) {
  return new RSVP.Promise(function(resolve, reject) {
    var opts = {};
    var child = spawn('ember', ['server']);
    var result = {
      output: [],
      errors: [],
      code: null
    };

    child.stdout.on('data', function (data) {
      var string = data.toString();
      if (string.indexOf('Build successful')>-1) {
        resolve(child);
      }
    });

    child.stderr.on('data', function (data) {
      var string = data.toString();
      process.stdout.write(string);
      reject(string);
    });

    child.on('close', function (code) {
      result.code = code;

      if (code !== 0) {
        reject(result);
      }
    });
  });
};
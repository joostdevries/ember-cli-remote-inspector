/* jshint node: true */
var assert = require("assert");
var cli = require('./helpers/ember-cli');
var request = require('request');

describe('ember debug', function(){
  this.timeout(10000);

  before(function(done) {
    var self = this;
    cli().then(function(child){
      self.ember = child;
      done();
    });
  });

  after(function() {
    this.ember.kill('SIGINT');
  });

  it('app html should contain socket code', function(done){
    request.get('http://localhost:4200', function(error, response, body) {
      assert(body.indexOf('window.EMBER_INSPECTOR_CONFIG.remoteDebugSocket')>-1);
      done();
    });
  });
});


describe('ember inspector', function(){
  this.timeout(10000);

  before(function(done) {
    var self = this;
    cli().then(function(child){
      self.ember = child;
      done();
    });
  });

  after(function() {
    this.ember.kill('SIGINT');
  });

  it('inspector page should contain socket code', function(done){
    request.get('http://localhost:30820', function(error, response, body) {
      assert(response.statusCode===200);
      assert(body.indexOf('window.EMBER_INSPECTOR_CONFIG.remoteDebugSocket')>-1, 'inspector page should contain socket code');
      done();
    });
  });

  it('inspector page should contain inspector js', function(done){
    request.get('http://localhost:30820/', function(error, response, body) {
      assert(response.statusCode===200);
      assert(body.indexOf('assets/ember-inspector.js')>-1);
      done();
    });
  });

  it('inspector js should be available', function(done){
    request.get('http://localhost:30820/assets/ember-inspector.js', function(error, response, body) {
      assert(response.statusCode===200);
      assert(body.length);
      done();
    });
  });

  it('socket.io js should be available', function(done){
    request.get('http://localhost:30820/socket.io/socket.io.js', function(error, response, body) {
      assert(response.statusCode===200);
      assert(body.length);
      done();
    });
  });

  it('socket.io should be available', function(done){
    request.get('http://localhost:30820/socket.io/?EIO=3&transport=polling', function(error, response, body) {
      assert(response.statusCode===200);
      assert(body.length);
      done();
    });
  });
});

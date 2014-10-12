// var debugClient = require('./addon/debug-client.js'),
//   debugServer = require('./addon/debug-server.js');
var express = require('express');
var debugServer = express();
var http = require('http').Server(debugServer);
var io = require('socket.io')(http);
var port = 30549;
/*
- Add a snippet to the debugServer html
- Render a debug page
- Websocket connection for debug page
- Websocket connection for debugServer
*/
debugServer.use(express.static(__dirname + '/public'));
debugServer.use('/ember-inspector-static', express.static(__dirname + '/../ember-inspector/dist_bookmarklet'));


debugServer.get('/ember-inspector', function(req, res) {
  var inspectorHtml = '<!doctype html>' +
  '<html>' +
    '<head>' +
      '<meta charset="utf-8">' +
      '<script src="//localhost:' + port + '/socket.io/socket.io.js" type="text/javascript"></script>' +
      '<script src="/ember-inspector-static/vendor/loader.js"></script>' +
      '<script src="/ember-inspector-static/vendor/resolver.js"></script>' +
      '<script src="/ember-inspector-static/vendor/jquery.js"></script>' +
      '<script src="/ember-inspector-static/vendor/handlebars.js"></script>' +
      '<script src="/ember-inspector-static/vendor/ember.prod.js"></script>' +
      '<script src="/ember-inspector-static/vendor/list-view.prod.js"></script>' +
      '<script src="/ember-inspector-static/panes/ember_extension.js"></script>' +
      '<script src="/ember-inspector-static/panes/start.js"></script>' +
      '<link href="/ember-inspector-static/panes/ember_extension.css" rel="stylesheet">' +
    '</head>' +
    '<body>' +
    '</body> ' +
    '</html>';

  res.end(inspectorHtml);
});


http.listen(port,'0.0.0.0', function(){
  console.log('listening on *:35020');
});

io.on('connection', function(socket){
  console.log('connection');
  socket.on('debugmsg', function(msg){
    console.dir(msg);
    io.emit('debugmsg', msg);
  });
});

// WILL COPY ALL THE THINGS FROM https://github.com/rwjblue/ember-cli-inject-live-reload/blob/master/index.js

module.exports = {
  name: 'ember-cli-remote-inspector',

  config: function(environment /*, appConfig */) {
    var ENV = {
      remoteDebug: true,
      remoteDebugHost: 'localhost',
      remoteDebugPort: 30820,
      remoteConsole: false
    }

    return ENV;
  },

  contentFor: function(type) {
    var debugPort = port;

    if (debugPort && type === 'head') {
      return '<script src="//jdv.local:' + port + '/socket.io/socket.io.js" type="text/javascript"></script>' +
        '<script src="//jdv.local:' + port + '/ember-inspector-static/ember_debug/ember_debug.js" type="text/javascript"></script>';
    }
  }
};

function isHTMLResponse(res) {
  return true;
}
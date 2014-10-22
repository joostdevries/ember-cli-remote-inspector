// Websocket server which handles data to/from the inspector
var fs = require('fs');
var express = require('express');
var remoteDebugger = express();

var remoteDebugServer = require('http').Server(remoteDebugger);
var remoteDebugSocket = require('socket.io')(remoteDebugServer);
var inspectorSocket = null;

// Load the inspector html from the node_modules folder
// (it should be there because we list it as a dependency)
var inspectorPath = __dirname + '/../node_modules/ember-extension/dist_websocket/';
var inspectorHtml = fs.readFileSync(inspectorPath + 'panes/index.html').toString();

remoteDebugger.use('/', express.static(inspectorPath)); // Serve inspector static files
remoteDebugger.get('/', function(req, res) {            // Serve inspector
  res.end(inspectorHtml);
});

module.exports = {
  /*
   Injects the script used to connect socket.io to the inspector into the inspector HTML
   */
  setRemoteDebugSocketScript: function(scriptHtml) {
    inspectorHtml = inspectorHtml.replace('{{ remote-port }}', scriptHtml)
  },

  /*
   Start the server for the inspector + socket.io
   */
  start: function(port, host) {
    remoteDebugServer.listen(port, host, function(){
      console.log('Ember inspector available on http://' + host + ':' + port + '.');
    });

    remoteDebugSocket.on('connect', function(socket){
      socket.on('emberInspectorMessage', function(msg){
        // If this message comes from the inspector, emit to all clients
        // and set inspectorSocket
        if(msg.from==='devtools') {
          inspectorSocket = socket;
          remoteDebugSocket.emit('emberInspectorMessage', msg);
        }
        // If the messge comes from a client, send only to inspector
        else if(inspectorSocket) {
          inspectorSocket.emit('emberInspectorMessage', msg);
        }
      });
    });
  }
}
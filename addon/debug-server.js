// Websocket server which handles data to/from the inspector
var fs = require('fs');
var express = require('express');
var remoteDebugger = express();
var remoteDebugServer = require('http').Server(remoteDebugger);
var remoteDebugSocket = require('socket.io')(remoteDebugServer);
var inspectorPath = __dirname + '/../node_modules/ember-extension/dist_websocket/';

var inspectorHtml = fs.readFileSync(inspectorPath + 'panes/index.html').toString();

remoteDebugger.use('/', express.static(inspectorPath));
remoteDebugger.get('/', function(req, res) {
  res.end(inspectorHtml);
});

var inspectorSocket = null;

module.exports = {
  setSocketScript: function(socketScript) {
    inspectorHtml = inspectorHtml.replace('{{ remote-port }}', socketScript)
  },

  start: function(port, host) {
    remoteDebugServer.listen(port, host, function(){
      console.log('Ember inspector available on http://' + host + ':' + port + '.');
    });

    remoteDebugSocket.on('connect', function(socket){
      socket.on('debugmsg', function(msg){
        if(msg.from==='devtools') {
          inspectorSocket = socket;
          remoteDebugSocket.emit('debugmsg', msg);
        }
        else if(inspectorSocket) {
          inspectorSocket.emit('debugmsg', msg);
        }
      });
    });
  }
}
var remoteDebugServer = require('./addon/debug-server');

module.exports = {
  name: 'ember-cli-remote-inspector',

  config: function(environment, appConfig) {
    var ENV = {
      remoteDebug: (environment==='development'),
      remoteDebugHost: 'localhost',
      remoteDebugPort: 30820,
      remoteConsole: false
    }

    return ENV;
  },

  getSocketScript: function(port, host) {
    return '<script src="//' + host + ':' + port + '/socket.io/socket.io.js" type="text/javascript"></script>' +
      '<script type="text/javascript">var remoteDebugSocket = io(\'http://' + host + ':'+port+'\')</script>';
  },

  getEmberDebugScript: function(port, host) {
    return '<script src="//' + host + ':' + port + '/ember_debug/ember_debug.js" type="text/javascript"></script>';
  },

  serverMiddleware: function(config) {
    var options = config.options;
    var project = options.project;
    var appConfig = project.config(options.environment);

    if((options.environment!=='development') || !appConfig.remoteDebug) {
      return;
    }
    
    process.env.EMBER_CLI_REMOTE_DEBUG_PORT = appConfig.remoteDebugPort;
    process.env.EMBER_CLI_REMOTE_DEBUG_HOST = appConfig.remoteDebugHost;

    remoteDebugServer.setSocketScript(this.getSocketScript(process.env.EMBER_CLI_REMOTE_DEBUG_PORT, process.env.EMBER_CLI_REMOTE_DEBUG_HOST));
    remoteDebugServer.start(process.env.EMBER_CLI_REMOTE_DEBUG_PORT, '0.0.0.0');
  },

  contentFor: function(type) {
    var port = 30820;

    if (type === 'head' && process.env.EMBER_CLI_REMOTE_DEBUG_PORT && process.env.EMBER_CLI_REMOTE_DEBUG_HOST) {
      return this.getSocketScript(process.env.EMBER_CLI_REMOTE_DEBUG_PORT, process.env.EMBER_CLI_REMOTE_DEBUG_HOST) + this.getEmberDebugScript(process.env.EMBER_CLI_REMOTE_DEBUG_PORT, process.env.EMBER_CLI_REMOTE_DEBUG_HOST);
    }
  }
};

function isHTMLResponse(res) {
  return true;
}
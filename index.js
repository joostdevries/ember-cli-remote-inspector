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

  getRemoteDebugSocketScript: function(port, host) {
    return '<script src="//' + host + ':' + port + '/socket.io/socket.io.js" type="text/javascript"></script>' +
           '<script type="text/javascript">' +
           '  window.EMBER_INSPECTOR_CONFIG = window.EMBER_INSPECTOR_CONFIG || {};' +
           '  window.EMBER_INSPECTOR_CONFIG.remoteDebugSocket = io(\'http://' + host + ':'+port+'\');' +
           '</script>';
  },

  getEmberDebugScript: function(port, host) {
    return '<script type="text/javascript">' +
           '  (function(){' +
           '    var script = document.createElement(\'script\');' +
           '    script.src = \'//' + host + ':' + port + '/ember_debug/ember_debug.js\';' +
           '    document.body.appendChild(script);' +
           '  })();' +
           '</script>';
  },

  serverMiddleware: function(config) {
    var options = config.options;
    var app = config.app;
    var project = options.project;
    var appConfig = project.config(options.environment);

    if((options.environment!=='development') || !appConfig.remoteDebug) {
      return;
    }

    var port = process.env.EMBER_CLI_REMOTE_DEBUG_PORT = appConfig.remoteDebugPort,
      host = process.env.EMBER_CLI_REMOTE_DEBUG_HOST = appConfig.remoteDebugHost;

    remoteDebugServer.setRemoteDebugSocketScript(this.getRemoteDebugSocketScript(port, host));
    remoteDebugServer.start(port, '0.0.0.0');

    app.use(function(req, res, next) {
      var cspHeader = res.getHeader('Content-Security-Policy')?'Content-Security-Policy':(res.getHeader('Content-Security-Policy-Report-Only')?'Content-Security-Policy-Report-Only':null);

      if(cspHeader) {
        var cspHeaderValue = res.getHeader(cspHeader);
        cspHeaderValue = cspHeaderValue.replace('connect-src \'self\' ', 'connect-src \'self\' http://'+host+':'+port+' ws://'+host+':'+port+' ')
        cspHeaderValue = cspHeaderValue.replace('script-src \'self\' ', 'script-src \'self\' \'unsafe-inline\' http://'+host+':'+port+' ')
        res.setHeader(cspHeader, cspHeaderValue);
        res.setHeader('X-' + cspHeader, cspHeaderValue);
      }

      next();
    });    
  },

  contentFor: function(type) {
    var port = process.env.EMBER_CLI_REMOTE_DEBUG_PORT,
      host = process.env.EMBER_CLI_REMOTE_DEBUG_HOST;

    if (type === 'body' && port && host) {
      return this.getRemoteDebugSocketScript(port, host) + this.getEmberDebugScript(port, host);
    }
  }
};

function isHTMLResponse(res) {
  return true;
}
var remoteDebugServer = require('./addon/debug-server');

module.exports = {
  name: 'ember-cli-remote-inspector',

  config: function(environment, appConfig) {
    var ENV = {
      remoteDebug: (environment==='development'),
      remoteDebugHost: 'localhost',
      remoteDebugScheme: '',
      remoteDebugPort: 30820,
      remoteConsole: false
    }

    return ENV;
  },

  getRemoteDebugSocketScript: function(port, host, scheme) {
    return '<script src="' + scheme + '//' + host + ':' + port + '/socket.io/socket.io.js" type="text/javascript"></script>' +
           '<script type="text/javascript">' +
           '  window.EMBER_INSPECTOR_CONFIG = window.EMBER_INSPECTOR_CONFIG || {};' +
           '  window.EMBER_INSPECTOR_CONFIG.remoteDebugSocket = io(\'' + scheme + '//' + host + ':'+port+'\');' +
           '</script>';
  },

  getEmberDebugScript: function(port, host, scheme) {
    return '<script type="text/javascript">' +
           '  (function(){' +
           '    var script = document.createElement(\'script\');' +
           '    script.src = \'' + scheme + '//' + host + ':' + port + '/ember_debug/ember_debug.js\';' +
           '    document.body.appendChild(script);' +
           '  })();' +
           '</script>';
  },

  /*
   Starts the server for the inspector + socket.io and
   updates CSP header if present
   */
  serverMiddleware: function(config) {
    var options = config.options;
    var app = config.app;
    var project = options.project;
    var appConfig = project.config(options.environment);

    if((options.environment!=='development') || !appConfig.remoteDebug) {
      return;
    }

    var port = process.env.EMBER_CLI_REMOTE_DEBUG_PORT = appConfig.remoteDebugPort,
      host = process.env.EMBER_CLI_REMOTE_DEBUG_HOST = appConfig.remoteDebugHost,
      scheme = process.env.EMBER_CLI_REMOTE_DEBUG_SCHEME = (appConfig.remoteDebugScheme ? appConfig.remoteDebugScheme+':' : '');

    remoteDebugServer.setRemoteDebugSocketScript(this.getRemoteDebugSocketScript(port, host, scheme));
    remoteDebugServer.start(port, '0.0.0.0');

    // Currently only used to update the CSP header
    // injected by ember-cli-content-security-policy
    app.use(function(req, res, next) {
      var cspHeader = res.getHeader('Content-Security-Policy')?'Content-Security-Policy':(res.getHeader('Content-Security-Policy-Report-Only')?'Content-Security-Policy-Report-Only':null);

      if(cspHeader) {
        var cspHeaderValue = res.getHeader(cspHeader),
          httpCspString = (scheme ? scheme + '//' : '') + host + ':' + port,
          wsCspString = 'ws://' + host + ':' + port;

        cspHeaderValue = cspHeaderValue.replace('connect-src \'self\' ', 'connect-src \'self\' '+httpCspString+' '+wsCspString+' ')
        cspHeaderValue = cspHeaderValue.replace('script-src \'self\' ', 'script-src \'self\' \'unsafe-inline\' '+httpCspString+' ')
        res.setHeader(cspHeader, cspHeaderValue);
        res.setHeader('X-' + cspHeader, cspHeaderValue);
      }

      next();
    });    
  },

  contentFor: function(type) {
    var port = process.env.EMBER_CLI_REMOTE_DEBUG_PORT,
      host = process.env.EMBER_CLI_REMOTE_DEBUG_HOST,
      scheme = process.env.EMBER_CLI_REMOTE_DEBUG_SCHEME;

    if (type === 'body' && port && host) {
      return this.getRemoteDebugSocketScript(port, host, scheme) + this.getEmberDebugScript(port, host, scheme);
    }
  }
};
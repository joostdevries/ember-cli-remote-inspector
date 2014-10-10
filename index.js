module.exports = {
  name: 'ember-cli-remote-inspector',

  // Injects a script to allow for remote debugging
  serverMiddleware: function(config) {
    var addonContent = this;
    var app = config.app;
    var options = config.options;
    var project = options.project;

    app.use(function(req, res, next) {
      var appConfig = project.config(options.environment);

      if(isHTMLResponse(res)) {
        injectRemoteDebugScript(res);
      }

      if(isDebuggerRequest(req)) {
        renderDebugger(res);
      }

      next();
    });
  }  
};

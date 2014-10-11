module.exports = {
  injectRemoteDebugScript: function(response) {
    return true;
  },

  isDebuggerRequest: function(request) {
    return true;
  }
}
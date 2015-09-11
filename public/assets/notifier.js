var notifier = {

  keys: [],

  addListener: function(key, listener) {
    var listeners = this.keys[key];
    if (!listeners) {
      listeners = [];
    }
    listeners.push(listener);
    this.keys[key] = listeners;
  },

  sendNotification: function(key) {
    // console.log(this.listeners);
    var listeners = this.keys[key];
    if (!listeners) {
      return;
    }
    for(var i=0;i<listeners.length;i++) {
      listeners[i]();
    }
  }
}

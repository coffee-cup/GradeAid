var notifier = {

  listeners: [],

  addListener: function(listener) {
    this.listeners.push(listener);
  },

  sendNotification: function() {
    // console.log(this.listeners);
    this.listeners[0]();
    for(var i=0;i<this.listeners.length;i++) {
      this.listeners[i]();
    }
  }
}

import Ember from 'ember';

var scope = {
  this: null
};

export default Ember.Route.extend({
  model: function() {
    scope.this = this;
    chrome.runtime.sendMessage({message: 'get_schedule'}, function(response) {
      scope.this.controllerFor('application').set('model', response.schedule);
    });
  }
});

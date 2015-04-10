import Ember from 'ember';

var scope = {
  this: null
};

export default Ember.Route.extend({
  model: function() {
    scope.this = this;
    chrome.runtime.sendMessage({message: 'get_schedule'}, function(response) {
    	var model = response.schedule;
      scope.this.controllerFor('application').set('model', model);
    });
  }
});

import Ember from 'ember';

var scope = {
  this: null
};

export default Ember.Route.extend({
  model: function(params) {
    scope.this = this;
    this.controllerFor('class').set('class_id', params.class_id)
    chrome.runtime.sendMessage({message: 'get_schedule'}, function(response) {
    	var model = response.schedule;
		scope.this.controllerFor('class').set('model', model);
    });
  }
});

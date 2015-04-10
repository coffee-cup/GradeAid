import Ember from 'ember';

var scope = {
  this: null
};

export default Ember.Route.extend({
  model: function() {
    scope.this = this;

		var newColour = '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
    this.controllerFor('new').set('colour', newColour);

    chrome.runtime.sendMessage({message: 'get_schedule'}, function(response) {
    	var model = response.schedule;
      scope.this.controllerFor('new').set('model', model);
      scope.this.controllerFor('new').set('class_name', '');
    });
  }
});

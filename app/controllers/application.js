import Ember from 'ember';

var scope = {
  this: null
};

export default Ember.Controller.extend({

  modelChanged: function() {
    var schedule = this.get('model');
    if (schedule) {
      console.log(schedule.classes);
      schedule.classes.forEach(function(element, index, array) {
        element.border = 'border-left: 10px solid ' + element.colour;
      });
    }
  }.observes('model'),

	init: function() {
		this._super();
		scope.this = this;

		chrome.runtime.onMessage.addListener(function(request, send, sendResponse) {
			if (request.message == 'new_class') {
				scope.this.set('model', request.schedule);
			}
		});
	}
});


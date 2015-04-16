import Ember from 'ember';

var scope = {
  this: null
};

export default Ember.Controller.extend({

  modelChanged: function() {
    var schedule = this.get('model');
    if (schedule) {
      schedule.classes.forEach(function(element, index, array) {
        element.border = 'border-left: 10px solid ' + element.colour;
      });
    }
  }.observes('model'),

  init: function() {
    this._super();
    scope.this = this;

    chrome.storage.onChanged.addListener(function() {
      getSchedule(function(schedule) {
        scope.this.set('model', schedule);
      });
    });

		// chrome.runtime.onMessage.addListener(function(request, send, sendResponse) {
		// 	if (request.type === 'update') {
		// 		scope.this.set('model', request.schedule);
		// 	}
		// });
}
});


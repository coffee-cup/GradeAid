import Ember from 'ember';

var scope = {
  this: null
};

export default Ember.Controller.extend({

  init: function() {
    this._super();
    scope.this = this;

    notifier.addListener(function() {
      getSchedule(function(schedule) {
        scope.this.set('model', schedule);
      });
    });
  },

  modelChanged: function() {
    Ember.run.scheduleOnce('afterRender', this, function(){
      Ember.$('.button-collapse').sideNav('hide');
    });

    var schedule = this.get('model');
    if (schedule) {
      schedule.classes.forEach(function(element, index, array) {
        element.border = 'border-left: 10px solid ' + element.colour;
      });
    }
  }.observes('model'),

		// chrome.runtime.onMessage.addListener(function(request, send, sendResponse) {
		// 	if (request.type === 'update') {
		// 		scope.this.set('model', request.schedule);
		// 	}
		// });

  actions: {
    willTransition: function(transition) {
        console.log('testset');
      }
    }
});


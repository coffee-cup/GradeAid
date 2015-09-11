import Ember from 'ember';

var scope = {
  this: null
};

export default Ember.Route.extend({
  beforeModel: function() {
    scope.this = this;
    console.log('getting schedule');
    getSchedule(function(schedule) {
      if (!schedule) {
        // do not transition to anything, wait on index page for something to happen
      } else if (schedule.last_class) {
        scope.this.transitionTo('class', schedule.last_class);
      } else {
        scope.this.transitionTo('new');
      }
    });
  }
});


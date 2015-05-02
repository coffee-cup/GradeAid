import Ember from 'ember';

var scope = {
  this: null
};

export default Ember.Route.extend({
  beforeModel: function() {
    this.transitionTo('class', 'veai5drqq');

    scope.this = this;
    getSchedule(function(schedule) {
    // this.transitionTo('class', 'veai5drqq');

      if (schedule.last_class) {
        scope.this.transitionTo('class', schedule.last_class);
      } else {
        scope.this.transitionTo('new');
      }
    });
  }
});


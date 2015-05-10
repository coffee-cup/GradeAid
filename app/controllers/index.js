import Ember from 'ember';

var scope = {
  this: null
};

export default Ember.Controller.extend({
  init: function() {
    this._super();
    scope.this = this;

    notifier.addListener('setup', function() {
      getSchedule(function(schedule) {
        if (schedule.last_class) {
          scope.this.transitionToRoute('class', schedule.last_class);
        } else {
          scope.this.transitionToRoute('new');
        }
      });
    });
  },
});


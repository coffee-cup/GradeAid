import Ember from 'ember';

var scope = {
  this: null
};

export default Ember.Route.extend({
  model: function() {
    scope.this = this;
    getSchedule(function(schedule) {
      scope.this.controllerFor('application').set('model', schedule);
    });
  }
});

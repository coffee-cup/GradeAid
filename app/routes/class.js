import Ember from 'ember';

var scope = {
  this: null
};

export default Ember.Route.extend({
  model: function(params) {
    scope.this = this;
    this.controllerFor('class').set('class_id', params.class_id);
    this.controllerFor('class').set('mark_title', '');

    getSchedule(function(schedule) {
      scope.this.controllerFor('class').set('model', schedule);

      var c = null;
      for (var i=0; i<schedule.classes.length; i++) {
        if (schedule.classes[i].id === params.class_id) {
          c = schedule.classes[i];
        }
      }

      scope.this.controllerFor('class').set('class', c);
    });
  }
});

import Ember from 'ember';

var scope = {
  this: null,
  newSchedule: null,
}

export default Ember.Controller.extend({

  schedule_import: null,

  import_error: "",

  schedule_string: "",

  init: function() {
    this._super();
    scope.this = this;
    scope.newSchedule = newSchedule
  },

  modelUpdate: function() {
    var schedule = this.get('model');
    if (schedule) {
      this.set('schedule_string', JSON.stringify(schedule));
    }
  }.observes('model'),

  actions: {
    resetSchedule: function() {
      var newSchedule = scope.newSchedule();
      saveSchedule(newSchedule);
    },

    importSchedule: function() {
      var newSchedule = this.get('schedule_import');
      if (newSchedule) {

      }
    }
  }
});


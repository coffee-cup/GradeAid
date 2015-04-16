import Ember from 'ember';

var scope = {
  this: null,
  newSchedule: null,
}

export default Ember.Controller.extend({

  init: function() {
    this._super();
    scope.this = this;
    scope.newSchedule = newSchedule
  },

  actions: {
    resetSchedule: function() {
      var newSchedule = scope.newSchedule();
      saveSchedule(newSchedule);
    }
  }
});


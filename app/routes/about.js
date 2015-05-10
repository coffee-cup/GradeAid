import Ember from 'ember';

var scope = {
  this: null
};

export default Ember.Route.extend({
  model: function() {
    scope.this = this;
    this.controllerFor('about').set('show_buy_us', false);
    getSchedule(function(schedule) {
      scope.this.controllerFor('about').set('model', schedule);
    });
  }
});

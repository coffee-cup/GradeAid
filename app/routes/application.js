import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return $.getJSON('assets/data/schedule.json').then(function(data) {
      console.log(data);
    });
});
// return $.getJSON('assets/data/schedule.json');
// return {
//   title: "hello"
// }

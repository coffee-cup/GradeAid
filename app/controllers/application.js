import Ember from 'ember';

export default Ember.Controller.extend({
  init: function() {
    this._super();

    console.log(this.get('title'));
  }
});


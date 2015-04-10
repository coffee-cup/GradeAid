import Ember from 'ember';

export default Ember.Controller.extend({

  init: function() {
    this._super();
  },

  randomColour: function() {
    var newColour = '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
    return newColour;
  },

  color: "red",

  actions: {
    newClass: function() {
      console.log(this.get("class_name"));
    },

    changeColour: function() {
      var newColour = '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
      this.set('colour', newColour);
      // $("#new-header").animate({ backgroundColor: newColour }, "slow");
      $('#new-header').css('background-color', newColour);
    }
  }

});

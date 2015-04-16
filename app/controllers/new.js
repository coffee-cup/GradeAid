import Ember from 'ember';

var scope = {
  this: null,
  class: null
};

export default Ember.Controller.extend({

  init: function() {
    this._super();
    scope.this = this;
  },

  backgroundColour: function() {
    return 'background-color: ' + this.get('colour');
  }.property('colour'),

  actions: {
    newClass: function() {
      var class_name = this.get('class_name');
      var colour = this.get('colour');

      if (class_name && colour) {
        var schedule = this.get('model');
        console.log(schedule);
        var newClass = createClass(class_name, colour);
        console.log(newClass);
        schedule.classes.push(newClass);

        scope.class = newClass;


        saveSchedule(schedule, function() {
          scope.this.transitionToRoute('class', scope.class.id);
        });

        // chrome.runtime.sendMessage({type: "update", message: 'new_class', schedule: schedule});
      } else {
        console.log('need to provide class name');
      }
    },

    changeColour: function() {
      var newColour = '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
      this.set('colour', newColour);
      // $('#new-header').css('background-color', newColour);
    }
  }
});

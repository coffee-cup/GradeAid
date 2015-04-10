import Ember from 'ember';

export default Ember.Controller.extend({

  backgroundColour: function() {
    return 'background-color: ' + this.get('colour');
  }.property('colour'),

  actions: {
    newClass: function() {
      var class_name = this.get('class_name');
      var colour = this.get('colour');

      if (class_name && colour) {
        var newClass = {title: class_name, colour: colour};
        var schedule = this.get('model');

        schedule.classes.push(newClass);

        chrome.runtime.sendMessage({message: 'new_class', schedule: schedule});
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

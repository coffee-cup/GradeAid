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
        var schedule = this.get('model');

        var newClass = createClass(class_name, colour);
        console.log(newClass);
        schedule.classes.push(newClass);

        chrome.runtime.sendMessage({type: "update", message: 'new_class', schedule: schedule});
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

// Math, Stats
function createClass(name, colour) {
  return {
    id: "id",
    name: name,
    colour: colour,
    grade: 0,
    components: [
      createComponent("Assignments", ["Assignment 1", "Assignment 2", "Assignment 3", "Assignment 4"]),
      createComponent("Midterms", ["Midterm 1", "Midterm 2"]),
      createComponent("Lab", ["Lab 1", "Lab 2", "Lab 3", "Lab 4"]),
      createComponent("Final", "Final")
    ]
  }
}

// Exams, Assignments, Labs
function createComponent(title, component_titles) {

  var marks = [];
  component_titles.foreach(function(element, index, array) {
    marks.push(createMark(element));
  });

  return {
    id: "id",
    title: title,
    grade: 0,
    marks: marks
  }
}

// Midterm 1, Lab 1, Assignment 1
function createMark(title) {
  return {
    id: "id",
    title: title,
    grade: 0,
    weight: 0,
    due: null, // this is a date, null when not set
  }
}

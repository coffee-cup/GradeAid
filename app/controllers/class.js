import Ember from 'ember';

var scope = {
  this: null
};


export default Ember.Controller.extend({

  init: function() {
    this._super();
    scope.this = this;

    chrome.storage.onChanged.addListener(function() {
      // do not actually need to listen for changes because this page
      // is the only place you can change these settings

      return;
      var class_id = scope.this.get('class_id');

      getSchedule(function(schedule) {
        scope.this.set('model', schedule);

        var c = null;
        for (var i=0; i<schedule.classes.length; i++) {
          if (schedule.classes[i].id === class_id) {
            c = schedule.classes[i];
          }
        }

        scope.this.set('class', c);
      });
    });
  },

	// return background colour in css based on the clases colour
	backgroundColour: function() {
		var c = this.get('class');
		if (c)
      {		return 'background-color: ' + c.colour;
  }
  return 'background-color: ' + 'white';
}.property('class'),

active_id: '9ye5mh57r',

changeActive: function() {
  var active_id = this.get('active_id');

  if (active_id) {

  }
}.observes('active_id').on('init'),

markChanged: function() {
  var grade = parseFloat(this.get('mark_grade'));
  var weight = parseInt(this.get('mark_weight'));
  var total = parseInt(this.get('mark_total'));

  var mark = this.get('active_mark');

  if (mark && grade && weight) {
    if (total) {
      grade = (grade / total) * 100;
    }

    // mark.set('grade', grade);
    // mark.set('weight', weight);
    console.log(mark);

    // mark.grade = grade;
    // mark.weight = weight;
  }
}.observes('mark_grade', 'mark_weight', 'mark_total'),

gradeChanged: function() {
  var schedule = this.get('model');
  var c = this.get('class');

  var total_grade = 0;
  var total_weight = 0;
  for (var i=0;i<c.marks.length;i++) {
    var m = c.marks[i];

    var grade = parseFloat(m.grade);
    var total = parseInt(m.total);
    var weight = parseFloat(m.weight);

    if (!grade || !total || !weight) {
      continue;
    }

    total_weight += weight;

    var percent = (grade / total);

    if (!percent || percent < 0) {
      continue;
    }

    var relative_grade = percent * weight;
    total_grade += relative_grade;
  }

  if (total_weight != 100) {
    this.set('error', 'Weights do not sum to 100');
  } else {
    this.set('error', '');
  }

  total_grade = total_grade.toFixed(1);
  if (total_grade > 100) {
    total_grade = 100;
  }

  // c.grade = total_grade;
  this.set('class.grade', total_grade);

  saveSchedule(schedule);
}.observes('class.marks.@each.grade', 'class.marks.@each.weight', 'class.marks.@each.total'),

actions: {

  addMark: function() {
    var mark_title = this.get('mark_title');

    if (mark_title) {
      var schedule = this.get('model');

      var mark = createMark(mark_title);
      var c = this.get('class');

      c.marks.pushObject(mark);
      this.set('class', c);

      saveSchedule(schedule);
    }
  },

  activeChanged: function(active_id) {
    var c = this.get('class');
    for (var i=0;i<c.marks.length;i++) {
      var m = c.marks[i];
      if (m.id === active_id) {
        this.set('active_mark', m);
        break;
      }
    }
  }

}
});


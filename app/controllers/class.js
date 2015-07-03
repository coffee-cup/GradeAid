import Ember from 'ember';

var scope = {
  this: null
};


export default Ember.Controller.extend({

  init: function() {
    this._super();
    scope.this = this;

    notifier.addListener('title_update', function() {
      getSchedule(function(schedule) {
        scope.this.set('model', schedule);
      });
    });
  },

  // return background colour in css based on the clases colour
  backgroundColour: function() {
    var c = this.get('class');
    if (c) {
      return 'background-color: ' + c.colour;
    }
    return 'background-color: ' + 'white';
  }.property('class'),

  // called when the schedule changes
  modelChanged: function() {
    var class_id = this.get('class_id');
    var schedule = this.get('model');

    console.log('the schedule changed to this');
    console.log(schedule);

    if (class_id && schedule) {
      var c = null;
      for (var i=0; i<schedule.classes.length; i++) {
        if (schedule.classes[i].id === class_id) {
          c = schedule.classes[i];
          break;
        }
      }

      scope.this.set('class', c);
    }
  }.observes('model'),

  // when the weight, total, or mark grade is called
  gradeChanged: function() {
    var schedule = this.get('model');
    var c = this.get('class');
    var active_mark = this.get('active_mark');

    if (!c || !schedule) {
      return;
    }

    // the total weight of all marks that have a grade inputed
    var total_weight = 0;

    // the total weight of all marks that have been created
    var summed_weight = 0;

    // the total grade overall for the entire semester
    var total_grade = 0;

    for (var i=0;i<c.marks.length;i++) {
      var m = c.marks[i];

      var grade = parseFloat(m.grade);
      var total = parseInt(m.total);
      var weight = parseFloat(m.weight);

      summed_weight += weight;

      // if the grade is null then do not consider it in grade calculation
      if (!grade) {continue;}

      if (!total) {total = 0;}
      if (!weight) {weight = 0;}

      var percent = (grade / total);

      if (!percent || percent < 0) {
        percent = 0;
      }

      total_weight += weight;
      total_grade += percent * weight;
    }

    total_weight = total_weight.toFixed(2);
    summed_weight = summed_weight.toFixed(2);

    // check if weights of all created marks sum to 100
    if (summed_weight != 100) {
      this.set('error', 'Weights do not sum to 100, Current: ' + summed_weight);
    } else {
      this.set('error', '');
    }

    total_grade = total_grade.toFixed(1);
    if (total_grade > 100) {
      total_grade = 100;
    }

    // prevent division by zero
    var relative_grade = 0;
    if (total_weight != 0) {
      relative_grade = total_grade / (total_weight / 100);
      relative_grade = relative_grade.toFixed(1);
    }

    // if the total grade is valid, calculate what is neeed to get 50-90%
    if (active_mark) {
      if (active_mark.weight && active_mark.weight > 0 && !active_mark.grade) {
        var needed = active_mark.needed;
        var needs = calculateNeeded(active_mark, relative_grade, total_weight);
        this.set('active_mark.needed', needs);
      } else {
        this.set('active_mark.needed', []);
      }
    }

    this.set('class.grade', relative_grade);
    this.set('class.total_weight', total_weight);

    if (active_mark) {
      saveSchedule(schedule);
    }
  }.observes('class.marks.@each.grade', 'class.marks.@each.weight', 'class.marks.@each.total'),

  wantChanged: function() {
    var active_mark = this.get('active_mark');
    var schedule = this.get('model');
    var c = this.get('class');

    if (active_mark && schedule && c) {
      var want = active_mark.need_input_want;
      if (want && active_mark.weight) {
        // neededFor(weight, current_grade, f)
        var need = neededFor(active_mark.weight, c.total_weight, c.grade, want)
        this.set('active_mark.need_input_need', need.grade);
      } else {
        this.set('active_mark.need_input_need', null);
      }

      saveSchedule(schedule);
    }
  }.observes('class.marks.@each.need_input_want'),

  actions: {

    deleteClass: function(class_id) {
      var c = this.get('class');
      var schedule = this.get('model');

      if (c && schedule) {
        schedule.classes.removeObject(c);

        if (schedule.classes[0]) {
          schedule.last_class = schedule.classes[0].id;
        } else {
          schedule.last_class = null;
        }

        saveSchedule(schedule, function() {
          scope.this.transitionToRoute('index');
        });
        // saveSchedule(schedule);
      }
    },

    deleteMark: function(mark_id) {
      var mark = this.get('active_mark');
      var c = this.get('class');
      c.marks.removeObject(mark);

      var schedule = this.get('model');
      if (schedule) {
        saveSchedule(schedule);
      }
    },

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

          var active_mark = m;
          if (active_mark.weight && active_mark.weight > 0 && (!active_mark.grade || active_mark.grade == 0)) {
            var needed = active_mark.needed;
            var needs = calculateNeeded(active_mark, c.grade, c.total_weight);
            this.set('active_mark.needed', needs);
          } else {
            this.set('active_mark.needed', []);
          }

          saveSchedule()

          break;
        }
      }
    }
  }
});

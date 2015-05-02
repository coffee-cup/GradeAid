import Ember from 'ember';

var scope = {
  this: null
};


export default Ember.Controller.extend({

  init: function() {
    this._super();
    scope.this = this;
  },

  // return background colour in css based on the clases colour
  backgroundColour: function() {
    var c = this.get('class');
    if (c) {
      return 'background-color: ' + c.colour;
    }
    return 'background-color: ' + 'white';
  }.property('class'),

  // sets all the needed sections max-heights
  setMaxHeights: function() {
    var c = this.get('class');
    if (c) {

      Ember.run.scheduleOnce('afterRender', this, function(){
        for (var i=0;i<c.marks.length;i++) {
          var m = c.marks[i];
          if (m.weight && m.weight > 0 && (!m.grade || m.grade == 0)) {
            Ember.$('#' + m.id).css('max-height', '100px');
          } else {
            Ember.$('#' + m.id).css('max-height', '0');
          }
        }
      });

    }
  }.observes('class'),

  active_id: '9ye5mh57r',

  changeActive: function() {
    var active_id = this.get('active_id');

    if (active_id) {

    }
  }.observes('active_id').on('init'),

  gradeChanged: function() {
    var schedule = this.get('model');
    var c = this.get('class');
    var active_mark = this.get('active_mark');

    if (!c || !schedule) {
      return;
    }

    // the grade was changed so re-calculate the total class grade
    var total_grade = 0;
    var total_weight = 0;
    for (var i=0;i<c.marks.length;i++) {
      var m = c.marks[i];

      var grade = parseFloat(m.grade);
      var total = parseInt(m.total);
      var weight = parseFloat(m.weight);

      if (!grade) {grade = 0;}
      if (!total) {total = 0;}
      if (!weight) {weight = 0;}

      total_weight += weight;

      var percent = (grade / total);

      if (!percent || percent < 0) {
        percent = 0;
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

    // if the total grade is valid, calculate what is neeed to get 50-90%
    if (active_mark) {
      if (active_mark.weight && active_mark.weight > 0 && (!active_mark.grade || active_mark.grade == 0)) {
        var needed = active_mark.needed;
        var needs = calculateNeeded(active_mark, total_grade, total_weight);
        // console.log(needs);
        this.set('active_mark.needed', needs);
        Ember.$('#' + active_mark.id).css('max-height', '100px');
      } else {
        this.set('active_mark.needed', []);
        Ember.$('#' + active_mark.id).css('max-height', '0');
      }
    }

    // c.grade = total_grade;
    this.set('class.grade', total_grade);

    saveSchedule(schedule);
  }.observes('class.marks.@each.grade', 'class.marks.@each.weight', 'class.marks.@each.total'),

  wantChanged: function() {
    var active_mark = this.get('active_mark');
    var schedule = this.get('model');
    var c = this.get('class');

    if (active_mark && schedule && c) {
      var want = active_mark.need_input_want;
      if (want && active_mark.weight) {
        // neededFor(weight, current_grade, f)
        var need = neededFor(active_mark.weight, c.grade, want)
        this.set('active_mark.need_input_need', need.grade);
      } else {
        this.set('active_mark.need_input_need', null);
      }
      saveSchedule(schedule);
    }
  }.observes('class.marks.@each.need_input_want'),

  actions: {

    deleteClass: function(class_id) {
      console.log('will delete class ' + class_id);
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
          break;
        }
      }
    }
  }
});


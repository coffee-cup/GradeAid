import Ember from 'ember';

var scope = {
  this: null,
  newSchedule: null,
}

export default Ember.Controller.extend({

  schedule_import: null,

  authors: ["Jake", "Abhi", "Tyson"],

  mades: ['Love', 'Happiness', 'Code', 'Molecules', 'Science', 'a Computer', 'a Dinosaur'],

  footer_message: "",

  import_error: "",

  schedule_string: "",

  init: function() {
    this._super();
    scope.this = this;
    scope.newSchedule = newSchedule

    notifier.addListener(function() {
      getSchedule(function(schedule) {
        scope.this.set('model', schedule);
      });
    });
  },

  modelUpdate: function() {
    var schedule = this.get('model');
    if (schedule) {
      this.set('schedule_string', JSON.stringify(schedule));
    }

    var mades = this.get('mades');
    var made = mades[Math.floor(Math.random()*mades.length)];

    var names = this.get('authors');
    var shuffled = shuffle(names);
    var message = 'Made with ' + made + ' by ' + shuffled[0] + ', ' + shuffled[1] + ', and ' + shuffled[2];
    this.set('footer_message', message);
  }.observes('model'),

  actions: {
    resetSchedule: function() {
      var newSchedule = scope.newSchedule();
      saveSchedule(newSchedule);
    },

    importSchedule: function() {
      var newScheduleString = this.get('schedule_import');
      if (newScheduleString) {
        var json = null;
        try {
          var json = JSON.parse(newScheduleString);
        } catch (err) {
          this.set('import_error', 'invalid schedule');
        }

        if (json) {
          // valid schedule we assume
          this.set('import_error', '');
          saveSchedule(json);
          this.set('schedule_import', '');
        }
      }
    }
  }
});


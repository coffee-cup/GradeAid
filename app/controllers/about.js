import Ember from 'ember';

var scope = {
  this: null,
  newSchedule: null,
}

export default Ember.Controller.extend({

  schedule_import: null,
  authors: ["Jake", "Abhi", "Tyson"],
  mades: ['Love', 'Happiness', 'Code', 'Molecules', 'Science', 'a Computer', 'a Dinosaur', 'Zest'],
  footer_message: "",
  import_error: "",
  current_schedule_id: null,
  schedule_string: "",
  schedules: null,
  new_title: "",

  init: function() {
    this._super();
    scope.this = this;
    scope.newSchedule = newSchedule;
    scope.saveSchedule = saveSchedule;
    scope.loadSchedule = loadSchedule;
    scope.addScheduleKey = addScheduleKey;

    notifier.addListener('new', function() {
      getSchedule(function(schedule) {
        scope.this.set('model', schedule);
      });
    });
  },

  modelUpdate: function() {
    console.log('model update');

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

    getSchedules(function(schedules) {
      console.log(schedules);

      if (schedules) {
        scope.this.set('current_schedule_id', getCurrentScheduleId());
        scope.this.set('schedules', schedules);

        Ember.run.scheduleOnce('afterRender', this, function(){
          var selectButton = Ember.$('#schedule-select-button').first();
          var selectDiv = Ember.$('#schedules-row').first();
          if (selectButton && selectDiv) {
            selectButton.css('display', 'none');
            selectDiv.css('cursor', 'default');
            selectDiv.css('background-color', '#FF3A37');
            selectDiv.css('color', 'white');
          }
        });
      }
    });
  }.observes('model'),

  titleChanged: function() {
    var schedules = this.get('schedules');
    if (schedules) {
      for (var i=0;i<schedules.length;i++) {
        saveSchedule(schedules[i]);
      }
    }
  }.observes('schedules.@each.title'),

  show_buy_us: false,
  bitcoin_address: '167gQGnatratDh4UJbXi63arMoLL3M92zA',

  actions: {
    createNew: function() {
      var title = this.get('new_title');
      if (title) {
        var newSchedule = scope.newSchedule(title);
        scope.addScheduleKey(newSchedule, function() {
          scope.saveSchedule(newSchedule, function() {
            scope.loadSchedule(newSchedule.id);
            notifier.sendNotification('new');
          });
        });
      }
    },

    selectSchedule: function(schedule_id) {
      var schedules = this.get('schedules');
      if (schedules) {
        for (var i=0;i<schedules.length;i++) {
          if (schedules[i].id === schedule_id) {
            scope.loadSchedule(schedules[i].id);
            scope.this.set('model', schedules[i]);
            console.log('loaded schedule with id ' + schedules[i].id);
          }
        }
      }
    },

    buyUs: function() {
      this.set('show_buy_us', true);
    },

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


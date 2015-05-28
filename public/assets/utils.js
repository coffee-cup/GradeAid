var ID = function () {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return Math.random().toString(36).substr(2, 9);
};

function calculateNeeded(mark, current_grade, total_weight) {
  if (!mark.weight) {
    return [];
  }

  return [
  neededFor(mark.weight, current_grade, 50),
  neededFor(mark.weight, current_grade, 60),
  neededFor(mark.weight, current_grade, 70),
  neededFor(mark.weight, current_grade, 80),
  neededFor(mark.weight, current_grade, 90)
    // neededFor(mark.weight, current_grade, 100)
    ];
  }

// calculates what you need to get on mark to have f overall
// pass in all values as percent (i.e. between 0 and 100)
function neededFor(weight, current_grade, f) {
  // weights in decimal (< 1), grades in percent (0 < g < 100)
  weight = weight / 100;
  var grade = (f - current_grade) / weight;
  // console.log('to get a ' + f + ' you need a ' + grade);
  return {'grade': grade.toFixed(0), 'final': f};
}

var scope = {
  current_schedule_id: null,
  setting_up: false // if have already starting setting up
}

function setupSchedule(callback) {
  // console.log('setting up');
  chrome.storage.sync.get('current_schedule_id', function(key) {
    var key = key.current_schedule_id;
    if (key) {
      // console.log('found current schedule key')
      // console.log('it is ' + key)
      scope.current_schedule_id = key;
      getScheduleWithId(key, callback);
    } else {
      // console.log('could not find current key');
      var newSchedule = scope.newSchedule();
      addScheduleKey(newSchedule, function() {
        saveSchedule(newSchedule, function() {
          scope.current_schedule_id = newSchedule.id;
        // console.log('created and saved new schedule');
        // console.log(newSchedule);
        chrome.storage.sync.set({'current_schedule_id': newSchedule.id}, function() {
          // console.log('set current schedule id and returning');
          callback(newSchedule);
        });
      });
      });
    }
  });
}

function loadSchedule(schedule_id) {
  scope.current_schedule_id = schedule_id;
  console.log('set current_schedule_id to ' + scope.current_schedule_id);
  chrome.storage.sync.set({'current_schedule_id': schedule_id}, function() {
    notifier.sendNotification('update');
  });
}

function addScheduleKey(schedule, callback) {
  chrome.storage.sync.get('all_schedule_ids', function(data) {
    var allScheduleIds = data.all_schedule_ids;
    if (!allScheduleIds) {
      allScheduleIds = [];
    }

    if (allScheduleIds.indexOf(schedule.id) == -1) {
      allScheduleIds.push(schedule.id);
      chrome.storage.sync.set({'all_schedule_ids': allScheduleIds}, function() {
        if (callback) {
          callback();
        }
      });
    } else {
      callback();
    }
  });
}

// returns the current schedule the user is on
function getSchedule(callback) {
  // console.log('getting schedule');

  if (scope.current_schedule_id) {
    // console.log('found current_schedule_id');
    getScheduleWithId(scope.current_schedule_id, callback);
  } else {
    if (!scope.setting_up) {
      scope.setting_up = true;
      setupSchedule(function(schedule) {
        notifier.sendNotification('setup');
        callback(schedule);
      });
    } else {
      callback(null);
    }
  }
}

// delete a schedule with id
// callback called with either true or false,
// depending on if delete worked
function deleteSchedule(schedule_id, callback) {
  var key = 'schedule-' + schedule_id;

  chrome.storage.sync.remove(key, function() {
    if (chrome.runtime.lastError) {
      console.log('error removing schedule');
      callback(false);
      return;
    }

    chrome.storage.sync.get('all_schedule_ids', function(data) {
      var allScheduleIds = data.all_schedule_ids;
      if (allScheduleIds) {

        // find the schedule id in all schedule ids
        // and remove it
        var index = allScheduleIds.indexOf(schedule_id);
        if (index != -1) {
          allScheduleIds.splice(index, 1);
          chrome.storage.sync.set({'all_schedule_ids': allScheduleIds}, function() {
            callback(true);
          });
        } else {
          callback(true);
        }
      }
    });
  });

  chrome.storage.sync.get(key, function(data) {
    var schedule = data[key];
    console.log('\n\nIN DELETE FUNCTION');
    console.log(schedule);
  });
}

// gets the current schedule id
function getCurrentScheduleId() {
  return scope.current_schedule_id;
}

// get a schedule with id
function getScheduleWithId(schedule_id, callback) {
  var schedule = null;
  var key = "schedule-" + schedule_id;

  console.log('trying to get schedule with key ' + key);
  chrome.storage.sync.get(key, function(data) {
    var schedule = data[key];
    if (schedule) {
      callback(schedule);
    } else {
      callback(null);
    }
  });
}

// get an array of all but current schdules
function getSchedules(callback) {
  chrome.storage.sync.get(['all_schedule_ids', 'current_schedule_id'], function(data) {
    var allSchedules = [];
    var allScheduleIds = data.all_schedule_ids;
    var currentScheduleId = data.current_schedule_id
    if (allScheduleIds && currentScheduleId) {
      chrome.storage.sync.get(currentScheduleId, function(data) {
        getSchedulesRecursive(allSchedules, allScheduleIds, currentScheduleId, 0, callback);
      });
    }
  });
}

// recursive function to get all get all but current schedule
// callback called with array of all schedules but current
function getSchedulesRecursive(allSchedules, allScheduleIds, currentScheduleId, index, callback) {
  console.log('in recursive with index: ' + index);
  console.log(allScheduleIds);
  if (index >= allScheduleIds.length) {
    callback(allSchedules);
    return;
  }

  var schedule_id = allScheduleIds[index];
  var key = "schedule-" + schedule_id;
  chrome.storage.sync.get(key, function(data) {
    var schedule = data[key];
    if (schedule && schedule.id != currentScheduleId) {
      allSchedules.push(schedule);
    } else {
      console.log('could not find a schedule in all schedule_ids');
    }

    getSchedulesRecursive(allSchedules, allScheduleIds, currentScheduleId, index + 1, callback);
  });
}

// create a new schedule with random id
function newSchedule(title) {
  if (!title) {
    title = "Schedule";
  }
  console.log('created new schedule');
  return {
    id: ID(),
    title: title,
    classes: [],
    last_class: null
  }
}

// so the function belongs to the scope object.
// allows me to use it on ember controllers
scope.newSchedule = newSchedule;

// save a schedule to chrome sync storage
function saveSchedule(schedule, callback) {
  if (!schedule) {
    if (callback) {
      callback(null);
    }
    return;
  }

  var key = "schedule-" + schedule.id;
  var saving = {};
  saving[key] = schedule;

  chrome.storage.sync.set(saving, function() {
    // addScheduleKey(schedule, function() {
      notifier.sendNotification('update');
      if (callback) {
        callback(schedule);
      }
    // });
});
}

// Math, Stats
function createClass(name, colour) {
  // console.log('creating class: ' + name + ': ' + colour);
  return {
    id: ID(),
    name: name,
    colour: colour,
    grade: 0,
    total_weight: 0,
    marks: []
  };
}

// Midterm 1, Lab 1, Assignment 1
function createMark(title) {
  // console.log('creating mark: '+ title);

  return {
    id: ID(),
    title: title,
    grade: 0,
    total: 100,
    total_grade: 0,
    weight: 0,
    needed: [],
    need_input_want: null,
    need_input_need: null,
    due: null, // this is a date, null when not set
  };
}


// CHANGED, DONT USE THIS ANYMORE

// Exams, Assignments, Labs
function createComponent(title, component_titles) {
  // console.log('creating component: ' + title + ': ' + component_titles);

  var marks = [];
  component_titles.forEach(function(element, index, array) {
    marks.push(createMark(element));
  });

  return {
    id: ID(),
    title: title,
    grade: -1,
    marks: marks
  };
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

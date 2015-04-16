var ID = function () {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return Math.random().toString(36).substr(2, 9);
};

function getSchedule(callback) {
  var schedule = null;
  chrome.storage.sync.get("schedule_key", function(data) {
    if (data.schedule_key) {
      console.log("found schedule");
      schedule = data.schedule_key;
      console.log(schedule);
      callback(schedule);
    } else {
      schedule = newSchedule();
      saveSchedule(schedule);
      callback(schedule);
    }
  });
}

function newSchedule() {
  console.log('created new schedule');
  return {
    id: ID(),
    title: "Schedule 1",
    classes: []
  }
}

function saveSchedule(schedule, callback) {
  var json = JSON.stringify(schedule);
  console.log('saving ' + json);
  chrome.storage.sync.set({"schedule_key": schedule}, function() {
    if (chrome.runtime.lastError) {
      console.log(chrome.runtime.lastError.message);
      return;
    }

    console.log('saved schedule');
    notifier.sendNotification();
    if (callback) {
      callback();
    }
  });
}


// Math, Stats
function createClass(name, colour) {
  // console.log('creating class: ' + name + ': ' + colour);

  return {
    id: ID(),
    name: name,
    colour: colour,
    grade: -1,
    marks: []
  };
}

// Midterm 1, Lab 1, Assignment 1
function createMark(title) {
  // console.log('creating mark: '+ title);

  return {
    id: ID(),
    title: title,
    grade: -1,
    total: 100,
    weight: 0,
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

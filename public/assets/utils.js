var ID = function () {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return Math.random().toString(36).substr(2, 9);
};


function calculateNeeded(mark, total_grade, total_weight) {
  if (!mark.weight) {
    return [];
  }

  var current_weight = total_weight - mark.weight;
  var current_grade = total_grade;

  console.log('current: ' + current_grade);
  console.log('curr_weight: ' + current_weight);
  console.log('weight: ' + mark.weight);

  return [
    neededFor(mark.weight, total_grade, 50),
    neededFor(mark.weight, total_grade, 60),
    neededFor(mark.weight, total_grade, 70),
    neededFor(mark.weight, total_grade, 80),
    neededFor(mark.weight, total_grade, 90),
    neededFor(mark.weight, total_grade, 100)
  ];
}

function neededFor(weight, current_grade, current_weight, wanted) {
  return (wanted - (current_weight * current_grade)) / weight;
}

function getSchedule(callback) {
  var schedule = null;
  chrome.storage.sync.get("schedule_key", function(data) {
    if (data.schedule_key) {
      // console.log("found schedule");
      schedule = data.schedule_key;
      // console.log(schedule);
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
  // console.log('saving ' + json);
  chrome.storage.sync.set({"schedule_key": schedule}, function() {
    if (chrome.runtime.lastError) {
      console.log(chrome.runtime.lastError.message);
      return;
    }

    // console.log('saved schedule');
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
    grade: 0,
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

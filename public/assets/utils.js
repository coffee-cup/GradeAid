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
    classes: [],
    last_class: null
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

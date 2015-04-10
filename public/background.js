var schedule = null;

chrome.app.runtime.onLaunched.addListener(function() {
  loadWindow();
  loadSchedule();
});

function saveSchedule() {
  var json = JSON.stringify(schedule);
  console.log('saving ' + json);
  chrome.storage.sync.set({"schedule_key": schedule}, function() {
    if (chrome.runtime.lastError) {
      console.log(chrome.runtime.lastError.message);
      return;
    }

    console.log('saved schedule');
    chrome.runtime.sendMessage({message: 'schedule_change'});
  });
}

function loadSchedule() {
  chrome.storage.sync.get("schedule_key", function(data) {
    if (data.schedule_key) {
      console.log("found schedule");
      schedule = data.schedule_key;
      console.log(schedule);
      chrome.runtime.sendMessage({message: "schedule_change"});
    } else {
      $.getJSON('assets/data/schedule.json', function(data) {
        console.log('created new schedule');
        schedule = data.schedule;
        saveSchedule();
      });
    }
  })
}

function loadWindow() {
  // Center window on screen.
  var width = 800;
  var height = 600;
  var screenWidth = screen.availWidth;
  var screenHeight = screen.availHeight;

  var b = {
    width: width,
    height: height,
    left: Math.round((screenWidth / 2) - (width / 2)),
    top: Math.round((screenHeight / 2) - (height / 2))
  };

  chrome.app.window.create('index.html', {
    id: "materialAppID",
    outerBounds: b
  });
}

chrome.runtime.onMessage.addListener(function(request, send, sendResponse) {
  console.log('here');

  if (request.message == 'get_schedule') {
    sendResponse({schedule: schedule});
  }
});

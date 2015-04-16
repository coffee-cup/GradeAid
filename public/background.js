var schedule = null;

chrome.app.runtime.onLaunched.addListener(function() {
  loadWindow();
  loadSchedule();
});

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

// chrome.runtime.onMessage.addListener(function(request, send, sendResponse) {
//   if (request.message === 'get_schedule') {
//     sendResponse({schedule: schedule});
//   }

//   if (request.type === 'update') {
//     schedule = request.schedule;
//     saveSchedule();
//   }
// });

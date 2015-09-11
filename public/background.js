var schedule = null;

chrome.app.runtime.onLaunched.addListener(function() {
  // firstLoad();
  loadWindow();
});

function firstLoad() {
  setupSchedule(function() {
    console.log("finished setting up");
  });
}

function loadWindow() {
  // Center window on screen.
  var width = 1280; // 1100
  var height = 800; // 700
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

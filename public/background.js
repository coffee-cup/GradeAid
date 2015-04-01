chrome.app.runtime.onLaunched.addListener(function() {
  // Center window on screen.
  var width = 1000;
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
});

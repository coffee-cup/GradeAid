chrome.app.runtime.onLaunched.addListener(function() {

  var width = 1000;
  var height = 600;
  var centerx = screen.width / 2;
  var centery = screen.height / 2;

  chrome.app.window.create('index.html', {
    'bounds': {
      'width': width,
      'height': height,
      'top': Math.round(centerx - (width / 2)),
      'left': Math.round(centery - (height / 2))
    }
  });
});

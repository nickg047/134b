chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('../src/list.html', {
    'outerBounds': {
      'width': 800,
      'height': 1000
    }
  });
});
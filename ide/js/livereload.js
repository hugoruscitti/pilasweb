var config = require('./package.json');

if (config.livereload) {
  var Gaze = require('gaze').Gaze;
  var gaze = new Gaze('index.html');

  gaze.on('all', function(event, filepath) {
    if (location)
      location.reload();
  });
}

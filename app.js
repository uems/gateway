var express = require('express');
var app = express();

require('./lib/middleware')(app);
require('./lib/routes')(app);

var server = app.listen(process.argv[2] || 2000, function() {
  console.log('Listening on port %d', server.address().port);
});

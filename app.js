var express = require('express');
var app = express();

var config = require('./lib/config');

require('./lib/middleware')(app);
require('./lib/routes')(app);

var server = app.listen(process.argv[2] || config.port, function() {
  console.log('Listening on port %d', server.address().port);
});

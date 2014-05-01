var express = require('express');
var app = express();

var middleware = require('./lib/middleware');
var personService = require('./lib/services/person_service');

app.use(middleware.setMaxListeners);
app.use(middleware.cors());
app.use(middleware.JsonUTF8);

app.get('/people/:xid', function(req, res) {
  personService.get(req.params.xid).then(function(result) {
    res.json(200, result);
  }).fail(function(err) {
    res.send(500, err);
  });
});

app.get('/people', function(req, res) {
  personService.search(req.query.q).then(function(result) {
    res.json(200, result);
  }).fail(function(err) {
    res.send(500, err);
  });
});

var server = app.listen(process.argv[2] || 2000, function() {
  console.log('Listening on port %d', server.address().port);
});

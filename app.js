var express = require('express');
var app = express();

var personService = require('./lib/services/person_service');

app.use(function(req, res, next) {
  res.header("Content-Type", "application/json; charset=utf-8");
  next();
});

app.get('/search/:query', function(req, res) {
  personService.search(req.params.query).then(function(result) {
    res.json(200, result);
  }).fail(function(err) {
    res.send(500, err);
  });
});

var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});

var express = require('express');
var app = express();

var middleware    = require('./lib/middleware');

app.use(middleware.cors());
app.use(middleware.JsonUTF8);
app.use(middleware.bodyParser());
app.use(middleware.setMaxListeners);
app.use(middleware.logger({ format: 'dev' }));

var personService = require('./lib/services/person_service');
var badgeService  = require('./lib/services/badge_service');


app.post('/people/:xid/print-:kind/:printer', function(req, res) {
  badgeService.print(req.params.xid, req.params.kind, req.params.printer).then(function(result) {
    res.json(200, result);
  }).fail(function(err) {
    res.send(500, err);
  }).done();
});

app.post('/people/:xid/set-name', function(req, res) {
  personService.setName(req.params.xid, req.body.name).then(function(result) {
    res.json(200, { changed: result });
  }).fail(function(err) {
    res.send(500, err);
  }).done();
});

app.post('/people/:xid/set-email', function(req, res) {
  personService.setEmail(req.params.xid, req.body.email).then(function(result) {
    res.json(200, { changed: result });
  }).fail(function(err) {
    res.send(500, err);
  }).done();
});

app.post('/people/:xid/set-document', function(req, res) {
  personService.setDocument(req.params.xid, req.body.document).then(function(result) {
    res.json(200, { changed: result });
  }).fail(function(err) {
    res.send(500, err);
  }).done();
});

app.get('/people/:xid', function(req, res) {
  personService.get(req.params.xid).then(function(result) {
    res.json(200, result);
  }).fail(function(err) {
    res.send(500, err);
  }).done();
});

app.get('/people', function(req, res) {
  if (!req.query.q) {
    res.send(400, { 'error': 'must provide query' });
  }
  personService.search(req.query.q).then(function(result) {
    res.json(200, result);
  }).fail(function(err) {
    res.send(500, err);
  }).done();
});

var server = app.listen(process.argv[2] || 2000, function() {
  console.log('Listening on port %d', server.address().port);
});

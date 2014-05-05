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

function errorAsJson(res) {
  return function(err) {
    console.log(err);
    return res.send(500, JSON.stringify(err));
  };
}

app.post('/people/:xid/pay-ticket/:tid', function(req, res) {
  personService.payTicket(req.params.xid, req.params);
});

app.post('/people/:xid/print-:kind/:printer', function(req, res) {
  badgeService.print(req.params.xid, req.params.kind, req.params.printer).then(function(result) {
    res.json(200, result);
  }).fail(errorAsJson(res)).done();
});

app.post('/people/:xid/give-badge', function(req, res) {
  badgeService.giveBadge(req.params.xid).then(function(result) {
    res.json(200, result);
  }).fail(errorAsJson(res)).done();
});

app.post('/people/:xid/accept-proof', function(req, res) {
  personService.acceptProof(req.params.xid, req.body.proofFor).then(function(result) {
    res.json(200, result);
  }).fail(errorAsJson(res)).done();
});

app.post('/people/:xid/set-name', function(req, res) {
  personService.setName(req.params.xid, req.body.name).then(function(result) {
    res.json(200, { changed: result });
  }).fail(errorAsJson(res)).done();
});

app.post('/people/:xid/set-email', function(req, res) {
  personService.setEmail(req.params.xid, req.body.email).then(function(result) {
    res.json(200, { changed: result });
  }).fail(errorAsJson(res)).done();
});

app.post('/people/:xid/set-document', function(req, res) {
  personService.setDocument(req.params.xid, req.body.document).then(function(result) {
    res.json(200, { changed: result });
  }).fail(errorAsJson(res)).done();
});

app.post('/people/:xid/set-badge-name', function(req, res) {
  personService.setBadgeName(req.params.xid, req.body.badgeName).then(function(result) {
    res.json(200, { changed: result });
  }).fail(errorAsJson(res)).done();
});

app.post('/people/:xid/set-badge-corp', function(req, res) {
  personService.setBadgeCorp(req.params.xid, req.body.badgeCorp).then(function(result) {
    res.json(200, { changed: result });
  }).fail(errorAsJson(res)).done();
});

app.post('/people/:xid/set-country', function(req, res) {
  personService.setCountry(req.params.xid, req.body.country).then(function(result) {
    res.json(200, { changed: result });
  }).fail(errorAsJson(res)).done();
});

app.post('/people/:xid/set-category', function(req, res) {
  personService.setCategory(req.params.xid, req.body.category).then(function(result) {
    res.json(200, { changed: result });
  }).fail(errorAsJson(res)).done();
});


app.get('/people/:xid', function(req, res) {
  personService.get(req.params.xid).then(function(result) {
    res.json(200, result);
  }).fail(errorAsJson(res)).done();
});

app.get('/people', function(req, res) {
  if (!req.query.q) {
    return res.send(400, { 'error': 'must provide query' });
  }
  personService.search(req.query.q).then(function(result) {
    res.json(200, result);
  }).fail(errorAsJson(res)).done();
});

var server = app.listen(process.argv[2] || 2000, function() {
  console.log('Listening on port %d', server.address().port);
});

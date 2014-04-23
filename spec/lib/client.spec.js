require('../spec_helper');

var expect = require('expect');
var nock = require('nock');

var clientLib = require('../../lib/client');

describe("Generic Rest Client", function() {
  var subject;
  var nockScope;
  var endpoint = 'http://localhost:9999';

  var leela = '{ "id": 123, "name": "Turanga Leela" }';
  var fry   = '{ "id": 456, "name": "Phillip J. Fry" }';
  var searchFry = '{ "query": "Fry", "total": 1, "items": [ { "link": "http://localhost:9999/people/456", "name": "Phillip J. Fry" } ] }';

  beforeEach(function() {
    subject = clientLib.build(endpoint);
    nockScope = nock(endpoint);

    nockScope.get('/people/123').reply(200, leela)
             .get('/people/456').reply(200, fry)
             .get('/people?query=Fry').reply(200, searchFry);
  });

  describe("available entities", function() {
    it("lists them all", function(ƒ) {
      subject.entities().then(function(entities) {
        expect(entities).toEqual(['people','groups']);
      }).µ(ƒ)
    });
  });

  describe("search", function() {
    it("by free-form search", function(ƒ) {
      subject.search('people', 'Fry').then(function(result) {
        expect(result.query).toEqual('Fry');
        expect(result.total).toEqual(1);
        expect(result.items[0].name).toEqual('Phillip J. Fry');
        // should it auto-fetch results?
      }).µ(ƒ);
    });
  });

  describe("get", function() {
    it("by entity and id", function(ƒ) {
      subject.get('people', 123).then(function(result) {
        expect(result.id).toEqual(123);
        expect(result.name).toEqual('Turanga Leela');
      }).µ(ƒ);
    });
  });

});

require('../spec_helper');

var expect = require('expect');
var nock = require('nock');

var clientLib = require('../../lib/client');

describe("Generic Rest Client", function() {
  var subject;
  var nockScope;
  var endpoint = 'http://localhost:9999';

  beforeEach(function() {
    subject = clientLib.build(endpoint);
    nockScope = nock(endpoint);
  });

  describe("available entities", function() {
    it("lists them all", function(ƒ) {
      subject.entities().then(function(entities) {
        expect(entities).toEqual(['people','groups']);
      }).µ(ƒ)
    });
  });

  describe("get", function() {
    var leela = '{ "id": 123, "name": "Turanga Leela" }';

    beforeEach(function() {
      nockScope.get('/people/123').reply(200, leela);
    });

    it("by entity and id", function(ƒ) {
      subject.get('people', 123).then(function(result) {
        expect(result.id).toEqual(123);
        expect(result.name).toEqual('Turanga Leela');
      }).µ(ƒ);
    });
  });

});

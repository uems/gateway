require('../spec_helper');

var Q = require('q');
var expect = require('expect');
var sinon  = require('sinon');

var stubs = {
  connection: require('../../lib/connection'),
  factory:    require('../../lib/factories/person_factory')
};

describe("Person Repository", function() {
  var library, subject;

  var endpoint = 'http://localhost:9999';

  var leela   = { "id": 123, "name": "Turanga Leela"   };
  var fry     = { "id": 456, "name": "Phillip J. Fry"  };
  var scruffy = { "id": 789, "name": "Phillip Scruffy" };

  var searchPhillip = { "query": "Phillip", "total": 2, "items": [
    { "link": endpoint+"/people/456", "name": "Phillip J. Fry" },
    { "link": endpoint+"/people/789", "name": "Phillip Scruffy" }
  ] };

  before(function() {
    sinon.stub(stubs.connection,'get');
    sinon.stub(stubs.factory, 'build');
    library = require('../../lib/repositories/person_repository');
    subject = library.build(endpoint);
  });

  describe("get by id", function(ƒ) {
    it("builds a person from /people/123", function() {
      stubs.connection.get.withArgs(endpoint+'/people/123').returns(Q.when(leela));
      stubs.factory.build.withArgs(leela).returns('built leela');

      subject.get(123).then(function(result) {
        expect(result).toEqual('built leela');
        sinon.assert.calledWith(stubs.factory.build, leela);
      }).µ(ƒ)
    });
  });

  describe("search by free form", function() {
    var query = "Phillip";

    it("builds one person for every item on result", function(ƒ) {
      stubs.connection.get.withArgs(endpoint+'/people', { query: query }).returns(Q.when(searchPhillip));
      stubs.connection.get.withArgs(endpoint+'/people/456').returns(Q.when(fry));
      stubs.connection.get.withArgs(endpoint+'/people/789').returns(Q.when(scruffy));
      stubs.factory.build.withArgs(fry).returns('built fry');
      stubs.factory.build.withArgs(scruffy).returns('built scruffy');

      subject.search(query).then(function(result) {
        expect(result.length).toBe(2);
        expect(result[0]).toBe('built fry');
        expect(result[1]).toBe('built scruffy');
      }).µ(ƒ);

    });


  });
});

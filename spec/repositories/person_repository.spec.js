require('../spec_helper');

var Q = require('q');
var expect = require('expect');
var sinon  = require('sinon');

var stubs = {
  connection: require('../../lib/connection'),
  factory:    require('../../lib/factories/person_factory')
};

describe('Person Repository', function() {
  var library, subject;
  var fakeConn;

  var repo     = 'New New York';
  var endpoint = 'http://localhost:9999';

  var leela   = { 'id': 123, 'name': 'Turanga Leela'   };
  var fry     = { 'id': 456, 'name': 'Phillip J. Fry'  };
  var scruffy = { 'id': 789, 'name': 'Phillip Scruffy' };

  var searchPhillip = { 'query': 'Phillip', 'total': 2, 'items': [
    { 'link': endpoint+'/people/456', 'name': 'Phillip J. Fry' },
    { 'link': endpoint+'/people/789', 'name': 'Phillip Scruffy' }
  ] };

  before(function() {
    fakeConn = { get: sinon.stub() };
    sinon.stub(stubs.connection, 'build').returns(fakeConn);
    sinon.stub(stubs.factory, 'build');
    library = require('../../lib/repositories/person_repository');
    subject = library.build(endpoint, repo);
  });

  describe('get by id', function(ƒ) {
    it('builds a person from /people/123', function() {
      fakeConn.get.withArgs(endpoint+'/people/123').returns(Q.when(leela));
      stubs.factory.build.withArgs(leela, repo).returns('built leela from NNY');

      subject.get(123).then(function(result) {
        sinon.assert.calledWith(stubs.factory.build, leela, repo);
        expect(result).toEqual('built leela from NNY');
      }).µ(ƒ);
    });
  });

  describe('search by free form', function() {
    var query = 'Phillip';

    it('builds one person for every item on result', function(ƒ) {
      fakeConn.get.withArgs(endpoint+'/people', { query: query }).returns(Q.when(searchPhillip));
      fakeConn.get.withArgs(endpoint+'/people/456').returns(Q.when(fry));
      fakeConn.get.withArgs(endpoint+'/people/789').returns(Q.when(scruffy));
      stubs.factory.build.withArgs(fry, repo).returns('built fry from NNY');
      stubs.factory.build.withArgs(scruffy, repo).returns('built scruffy from NNY');

      subject.search(query).then(function(result) {
        expect(result.length).toBe(2);
        expect(result[0]).toBe('built fry from NNY');
        expect(result[1]).toBe('built scruffy from NNY');
      }).µ(ƒ);

    });


  });
});

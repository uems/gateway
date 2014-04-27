require('../spec_helper');

var Q = require('q');

var sinon  = require('sinon');
var expect = require('expect');

var stubs = {
  repository: require('../../lib/repositories/person_repository'),
  config:     require('../../lib/config.js')
};

describe("Person Service", function() {
  var service;

  var endpoint1 = 'http://localhost:8888';
  var endpoint2 = 'http://localhost:9999';
  var repository1 = { search: sinon.stub(), get: sinon.stub() };
  var repository2 = { search: sinon.stub(), get: sinon.stub() };

  before(function() {
    stubs.config.repositories = {
      repo1: endpoint1,
      repo2: endpoint2
    };
    sinon.stub(stubs.repository,'build');
    stubs.repository.build.withArgs(endpoint1, 'repo1').returns(repository1);
    stubs.repository.build.withArgs(endpoint2, 'repo2').returns(repository2);

    service = require("../../lib/services/person_service.js");
  });

  it("has a repository for each endpoint", function() {
    sinon.assert.calledWith(stubs.repository.build, endpoint1, 'repo1');
    sinon.assert.calledWith(stubs.repository.build, endpoint2, 'repo2');
  });

  describe("get", function() {
    var id = 123;

    beforeEach(function() {
      repository1.get.withArgs(id).returns(Q.when('Phillip from repo1'));
      repository2.get.withArgs(id).returns(Q.when('Phillip from repo2'));
    });

    it("chooses a certain id from a given service", function() {
      service.get('repo1', id).then(function(results) {
        expect(result).toBe('Phillip from repo1');
        sinon.assert.calledWith(repository1.get, id);
      });
    });
  });

  describe("search", function() {
    var query = 'Phillip';

    beforeEach(function() {
      repository1.search.withArgs(query).returns(Q.when([ 'Phillip from repo1' ]));
      repository2.search.withArgs(query).returns(Q.when([ 'Phillip from repo2', 'Other Phillip from repo2' ]));
    });

    it("is distributed accross people repositories", function(ƒ) {
      service.search(query).then(function(results) {
        expect(results.length).toBe(3);

        expect(results).toInclude('Phillip from repo1');
        expect(results).toInclude('Phillip from repo2');
        expect(results).toInclude('Other Phillip from repo2');

        sinon.assert.calledWith(repository1.search, query);
        sinon.assert.calledWith(repository2.search, query);
      }).µ(ƒ);
    });
  });


});

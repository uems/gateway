require('../spec_helper');

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
  var repository1 = { search: sinon.stub() };
  var repository2 = { search: sinon.stub() };

  before(function() {
    stubs.config.repositories = [ endpoint1, endpoint2 ];
    sinon.stub(stubs.repository,'build');
    stubs.repository.build.withArgs(endpoint1).returns(repository1);
    stubs.repository.build.withArgs(endpoint2).returns(repository2);

    service = require("../../lib/services/person_service.js");
  });

  it("has a repository for each endpoint", function() {
    sinon.assert.calledWith(stubs.repository.build, endpoint1);
    sinon.assert.calledWith(stubs.repository.build, endpoint2);
  });

  describe("search", function() {
    var query = 'Phillip';

    beforeEach(function() {
      repository1.search.withArgs(query).returns([ 'Phillip from repo1' ]);
      repository2.search.withArgs(query).returns([ 'Phillip from repo2', 'Other Phillip from repo2' ]);
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

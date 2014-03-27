var expect = require('expect');

var client = require('../../lib/client');

describe("Client", function() {

  var subject;

  beforeEach(function() {
    subject = client.build();
  });

  describe("search", function() {
    it("promises multiple wrapped entries", function() {
      var result = subject.search();

      return expect(result).to.eventually.be([]);
    });
  });

});

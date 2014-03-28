var expect = require('expect');

var client = require('../../lib/client');

describe("Client", function() {

  var subject;

  beforeEach(function() {
    subject = client.build();
  });

  describe("search", function() {
    it("promises multiple wrapped entries", function(callback) {
      subject.search().then(function(result) {
        expect(result).toEqual([]);
      }).done(callback,callback);

    });
  });

});

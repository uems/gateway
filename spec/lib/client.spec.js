require('../spec_helper');
var expect = require('expect');
var clientLib = require('../../lib/client');



describe("RestClient", function() {
  var subject;
  var endpoint = 'http://localhost:9999';

  beforeEach(function() {
    subject = clientLib.build(endpoint);
  });

  describe("get", function() {
    it("by entity and id", function(ƒ) {
      subject.get('person', 123).then(function(result) {
      }).µ(ƒ);
    });
  });

});

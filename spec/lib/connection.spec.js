require('../spec_helper');

var expect = require('expect');
var nock = require('nock');
var library = require('../../lib/connection');

describe("Connection", function() {
  var subject;
  var nockScope;
  var base = 'http://localhost:9999';
  var auth = { user: 'a_user', pass: 'a_pass' };

  var content = '{ "a_property": "xunga" }';

  beforeEach(function() {
    subject = library.build(auth);
    nockScope = nock(base);
  });

  describe("getting an URL", function() {
    var parms = { 'query': 'Xanxa' };

    it("simple case, no parms", function(ƒ) {
      nockScope.get('/le_path').reply(200, content);

      subject.get(base+"/le_path").then(function(result) {
        expect(result.a_property).toBe('xunga');
      }).µ(ƒ);
    });

    it("with parms", function(ƒ) {
      nockScope.get('/le_path?query=Xanxa').reply(200, content);

      subject.get(base+"/le_path", parms).then(function(result) {
        expect(result.a_property).toBe('xunga');
      }).µ(ƒ);
    });
  });
});

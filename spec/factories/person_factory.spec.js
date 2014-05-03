require('../spec_helper');

var Q = require('q');
var expect = require('expect');

describe('Person Factory', function() {
  var library;

  before(function() {
    library = require('../../lib/factories/person_factory.js');
  });
  describe('build', function() {
    var data = { id: 123, name: 'Arya Stark' };
    var source = 'westeros';
    var built;

    beforeEach(function() {
      built = library.build(data, source, Q.when([]));
    });

    it('inserts source name in object', function() {
      built.then(function(person) {
        expect(person.source).toEqual('westeros');
      })
    });

    it('inserts xid in object', function() {
      built.then(function(person) {
        expect(person.xid).toEqual('westeros-123');
      });
    });

    it("replaces uri with this host's", function() {
      built.then(function(person) {
        expect(person.uri).toEqual('http://localhost:3000/people/westeros-123');
      });
    });
  });

});

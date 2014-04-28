require('../spec_helper');

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
      built = library.build(data, source);
    });

    it('inserts source name in object', function() {
      expect(built.source).toEqual('westeros');
    });

    it('inserts xid in object', function() {
      expect(built.xid).toEqual('westeros-123');
    });

    it("replaces uri with this host's", function() {
      expect(built.uri).toEqual('http://localhost:3000/people/westeros-123');
    });
  });

});

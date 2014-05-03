var _ = require('underscore');
var Q = require('q');

var connection = require('../connection');
var factory    = require('../factories/person_factory');
var history    = require('../repositories/history');

function People(descriptor) {
  var conn = connection.build({ user: descriptor.user, pass: descriptor.pass });

  function getPersonByStub(stub) {
    var transitions = history.getTransitions(stub.xid);
    return conn.get(stub.link).then(_.partial(factory.build, _, descriptor.name, transitions));
  }
  this.get = function(id) {
    var stub = {
      link: descriptor.endpoint + '/people/' + id,
      xid:  descriptor.name  + "-" + id,
    };
    return getPersonByStub(stub);
  };
  this.search = function(query) {
    var url = descriptor.endpoint + '/people';
    var parms = { query: query };

    return conn.get(url, parms).then(function(result) {
      var promises = _.chain(result.items.slice(0,5))
                      .map(getPersonByStub)
                      .value();
      return Q.all(promises);
    });
  };
}

module.exports = {
  build: function(descriptor) { return new People(descriptor); }
};

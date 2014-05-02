var _ = require('underscore');
var Q = require('q');

var connection = require('../connection');
var factory    = require('../factories/person_factory');

function PersonRepository(descriptor) {
  var conn = connection.build({ user: descriptor.user, pass: descriptor.pass });

  function getPersonByHref(href) {
    return conn.get(href).timeout(descriptor.timeout || 10000).then(_.partial(factory.build, _, descriptor.name));
  }
  this.get = function(id) {
    var href = descriptor.endpoint + '/people/' + id;
    return getPersonByHref(href);
  };
  this.search = function(query) {
    var url = descriptor.endpoint + '/people';
    var parms = { query: query };

    return conn.get(url, parms).then(function(result) {
      var promises = _.chain(result.items).pluck('link').map(getPersonByHref).value();
      return Q.all(promises);
    });
  };
}

module.exports = {
  build: function(descriptor) { return new PersonRepository(descriptor); }
};

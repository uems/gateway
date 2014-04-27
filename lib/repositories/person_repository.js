var _ = require('underscore');
var Q = require('q');

var connection = require('../connection');
var factory    = require('../factories/person_factory');

function PersonRepository(endpoint, name) {
  function getPersonByHref(href) {
    return connection.get(href).then(_.partial(factory.build, _, name));
  }
  this.get = function(id) {
    var href = endpoint + '/people/' + id;
    return getPersonByHref(href);
  };
  this.search = function(query) {
    var url = endpoint + '/people';
    var parms = { query: query };

    return connection.get(url, parms).then(function(result) {
      var promises = _.chain(result.items).pluck('link').map(getPersonByHref).value();
      return Q.all(promises);
    });
  };
}

module.exports = {
  build: function(endpoint, name) { return new PersonRepository(endpoint, name); }
};

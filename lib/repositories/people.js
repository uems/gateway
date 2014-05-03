var _ = require('underscore');
var Q = require('q');

var connection = require('../connection');
var factory    = require('../factories/person_factory');

function People(descriptor) {
  var conn = connection.build({ user: descriptor.user, pass: descriptor.pass });

  function getPersonByHref(href, transitions) {
    return conn.get(href).then(_.partial(factory.build, _, descriptor.name, transitions));
  }
  this.get = function(id, transitions) {
    var href = descriptor.endpoint + '/people/' + id;
    return getPersonByHref(href, transitions);
  };
  this.search = function(query) {
    var url = descriptor.endpoint + '/people';
    var parms = { query: query };

    return conn.get(url, parms).then(function(result) {
      var promises = _.chain(result.items.slice(0,5)).pluck('link').map(getPersonByHref).value();
      return Q.all(promises);
    });
  };
}

module.exports = {
  build: function(descriptor) { return new People(descriptor); }
};

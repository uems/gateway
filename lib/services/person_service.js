var Q = require('q');
var _ = require('underscore');

var config     = require('../config');
var repository = require('../repositories/person_repository');

var shallowFlatten = _.partial(_.flatten, _, true);

function PersonService() {
  var repositories = {};
  _.each(config.repositories, function(descriptor) {
    repositories[descriptor.name] = repository.build(descriptor);
  });

  this.search = function(query) {
    var promises = _.chain(repositories).invoke('search', query).value();
    return Q.all(promises).then(shallowFlatten);
  };

  this.get = function(xid) {
    var parts = xid.split(/-/);
    var source = parts[0];
    var id     = parseInt(parts[1]);
    return repositories[source].get(id);
  };
}

module.exports = new PersonService();

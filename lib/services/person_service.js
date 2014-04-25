var Q = require('q');
var _ = require('underscore');

var config     = require('../config');
var repository = require('../repositories/person_repository');

var shallowFlatten = _.partial(_.flatten, _, true);

function PersonService() {
  var repositories = config.repositories.map(repository.build);

  this.search = function(query) {
    var promises = _.chain(repositories).invoke('search', query).value();
    return Q.all(promises).then(shallowFlatten);
  }
}

module.exports = new PersonService();

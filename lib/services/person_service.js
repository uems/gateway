var Q = require('q');
var _ = require('underscore');

var config     = require('../config');

var people  = require('../repositories/people');
var history = require('../repositories/history');

var shallowFlatten = _.partial(_.flatten, _, true);

function PersonService() {
  var repositories = {};

  _.each(config.repositories, function(descriptor) {
    repositories[descriptor.name] = people.build(descriptor);
  });

  this.search = function(query) {
    var promises = _.chain(repositories).invoke('search', query).value();
    return Q.all(promises).then(shallowFlatten);
  };

  this.get = function(xid) {
    var parts  = xid.split(/-/);
    var source = parts[0];
    var id     = parseInt(parts[1]);

    var transitions = history.getTransitions(xid);
    return repositories[source].get(id, transitions);
  };

  this.setName = function(xid, name) {
    return history.setName(xid, name);
  };
  this.setEmail = function(xid, email) {
    // FIXME: check for email collisions!
    return history.setEmail(xid, email);
  };
  this.setDocument = function(xid, document) {
    // FIXME: check for document collisions!
    return history.setDocument(xid, document);
  };

}

module.exports = new PersonService();

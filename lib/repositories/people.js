var _ = require('underscore');
var Q = require('q');

var pmongo = require('promised-mongo');

var connection = require('../connection');
var factory    = require('../factories/person_factory');
var history    = require('../repositories/history');

var cashTickets = require('../services/cash_ticket_service');

function getPayableTicket(person) {
  return cashTickets.getPayableTicket(person).then(function(ticket) {
    person.setPayableTicket(ticket);
    return person;
  });
}

function ExternalPeople(descriptor) {
  var conn = connection.build({ user: descriptor.user, pass: descriptor.pass });

  function getPersonByLocator(stub) {
    var transitions = history.getCurrentTransitions(stub.xid);
    return conn.get(stub.link).then(function(rawPerson) {
      return factory.build(rawPerson, descriptor.name, transitions);
    });
  }

  this.get = function(id) {
    var stub = {
      link: descriptor.endpoint + '/people/' + id,
      xid:  descriptor.name  + "-" + id,
    };
    return getPersonByLocator(stub).then(getPayableTicket);
  };
  this.search = function(query) {
    var url = descriptor.endpoint + '/people';
    var parms = { query: query };

    return conn.get(url, parms).then(function(result) {
      var promises = _.chain(result.items.slice(0,5))
                      .map(getPersonByLocator)
                      .map(Q.promised(getPayableTicket))
                      .value();
      return Q.all(promises);
    });
  };
}

function LocalPeople() {
  var db = pmongo('history', ['people']);
  var descriptor = 'local';

  function getPersonById(id) {
    return db.people.findOne({ id: id }).then(function(rawPerson) {
      return buildWithTransitions(rawPerson);
    });
  }

  function buildWithTransitions(rawPerson) {
    var transitions = history.getCurrentTransitions(rawPerson.xid);
    return factory.build(rawPerson, descriptor, transitions);
  }

  function findByQuery(query) {
    var pattern = new RegExp(query);
    return db.people.find({ email: pattern }).toArray();
  }

  this.create = function(email) {
    return db.people.count().then(function(count) {
      var nextId = count + 1;
      var xid = descriptor + '-' + nextId;
      var now = (new Date()).toISOString();
      return db.people.insert({ email: email, when: now, id: nextId, xid: xid }).then(function() { return nextId; });
    });
  };
  this.get = function(id) {
    return getPersonById(id).then(getPayableTicket);
  };
  this.search = function(query) {
    return findByQuery(query).then(function(results) {
      var promises = _.chain(results)
                      .map(buildWithTransitions)
                      .map(Q.promised(getPayableTicket))
                      .value();
      return Q.all(promises);
    });
  };
}

module.exports = {
  buildExternal: function(descriptor) { return new ExternalPeople(descriptor); },
  localRepository: new LocalPeople()
};

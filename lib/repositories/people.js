var _ = require('underscore');
var Q = require('q');

var pmongo = require('promised-mongo');

var connection = require('../connection');
var factory    = require('../factories/person_factory');
var history    = require('../repositories/history');

var personService = require('../services/person_service');

function getPayableTicket(person) {
  var cashTickets   = require('../services/cash_ticket_service');

  return cashTickets.getPayableTicket(person).then(function(ticket) {
    person.setPayableTicket(ticket);
    return person;
  });
}
function getIssuableCertificate(person) {
  var certificates  = require('../services/certificate_service');

  return certificates.getIssuableCertificate(person).then(function(certificate) {
    person.setIssuableCertificate(certificate);
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
    return getPersonByLocator(stub).then(getPayableTicket).then(getIssuableCertificate);
  };
  this.search = function(query) {
    var url = descriptor.endpoint + '/people';
    var parms = { query: query };

    return conn.get(url, parms).then(function(result) {
      var promises = _.chain(result.items.slice(0,5))
                      .map(getPersonByLocator)
                      .map(Q.promised(getPayableTicket))
                      .map(Q.promised(getIssuableCertificate))
                      .value();
      return Q.all(promises);
    });
  };

  this.listing = function() {
    var url = descriptor.endpoint + '/listing';

    return conn.get(url);
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
    var asId    = parseInt(query.replace(/l(ocal)?-/, ''));
    return db.people.find({ $or: [
      { email: pattern },
      { id: asId },
    ]}).toArray();
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
    return getPersonById(id).then(getPayableTicket).then(getIssuableCertificate);
  };
  this.search = function(query) {
    return findByQuery(query).then(function(results) {
      var promises = _.chain(results)
                      .map(buildWithTransitions)
                      .map(Q.promised(getPayableTicket))
                      .map(Q.promised(getIssuableCertificate))
                      .value();
      return Q.all(promises);
    });
  };
  this.listing = function() {
    return Q.when({});
  };
}

module.exports = {
  buildExternal: function(descriptor) { return new ExternalPeople(descriptor); },
  localRepository: new LocalPeople()
};

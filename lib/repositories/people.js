var _ = require('underscore');
var Q = require('q');

var connection = require('../connection');
var factory    = require('../factories/person_factory');
var history    = require('../repositories/history');

var cashTickets = require('../services/cash_ticket_service');


function People(descriptor) {
  var conn = connection.build({ user: descriptor.user, pass: descriptor.pass });

  function getPersonByLocator(stub) {
    var transitions = history.getCurrentTransitions(stub.xid);
    return conn.get(stub.link).then(function(rawPerson) {
      return factory.build(rawPerson, descriptor.name, transitions);
    });
  }
  function getPayableTicket(person) {
    if (person.hasValidTickets()) { return person; }
    return cashTickets.getPayableTicket(person.xid, person.category).then(function(ticket) {
      person.setPayableTicket(ticket);
      return person;
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

module.exports = {
  build: function(descriptor) { return new People(descriptor); }
};

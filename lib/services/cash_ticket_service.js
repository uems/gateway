var Q = require('q');
var _ = require('underscore');

var personService = require('./person_service');
var history = require('../repositories/history.js');

var FULL_PRICE = 300;

var PRICE_MAP = {
  'Estudante':             150,
  'Participante':          FULL_PRICE,
  'International':         FULL_PRICE,
  'Corporativo':           FULL_PRICE,
  'Empenho':               null,
  'Caravaneiro':           150,
  'Escola Técnica':        null,
  'Voluntarios':           null,
  'Palestrante Rejeitado': FULL_PRICE
};

function CashTicketService() {

  function priceForCategory(category, promotionalCode) {
    var categoryPrice = PRICE_MAP[category];
    if (categoryPrice != FULL_PRICE) { return categoryPrice; }
    if (!promotionalCode) { return categoryPrice; }
    var multiplier = (100 - (promotionalCode.offRate || 0))/100;
    return parseInt(categoryPrice * multiplier); // we want round numbers, no cents
  }

  this.getPayableTicket = function(person) {
    if (!_.isEmpty(person.validTickets)) { return Q.when(null); }
    person.category = person.category || 'Participante';
    if (!PRICE_MAP[person.category]) {
      return Q.when(null);
    }
    return Q.when({
      id: ["local", person.category, person.xid].join('-'),
      method: "cash",
      status: "pending",
      price: priceForCategory(person.category, person.promotionalCode),
      paid: null,
      grants: person.category,
      creation_date: (new Date()).toISOString(),
      approval_date: null
    });
  };

  this.getPaymentsByIp = function(ip) {
    return history.findAcceptCashByIp(ip).then(function(transitions) {
      return _(transitions).map(function(tr) {
        return personService.get(tr.xid).then(function(person) {
          tr.person = person;
          return tr;
        });
      });
    });
  };


}

module.exports = new CashTicketService();

var Q = require('q');

var PRICE_MAP = {
  'Estudante': 150,
  'Participante': 300,
  'International': 300,
  'Corporativo': 300,
  'Empenho': null,
  'Caravaneiro': 150,
  'Escola Técnica': null,
  'Voluntarios': null,
  'Palestrante Rejeitado': 300
};

function CashTicketService() {

  function priceForCategory(category) {
    return PRICE_MAP[category];
  }

  this.getPayableTicket = function(xid, category) {
    if (!PRICE_MAP[category]) {
      return Q.when(null);
    }
    return Q.when({
      id: ["local",category,xid].join('-'),
      method: "cash",
      status: "pending",
      price: priceForCategory(category),
      paid: null,
      grants: category,
      creation_date: (new Date()).toISOString(),
      approval_date: null
    });
  };

}

module.exports = new CashTicketService();

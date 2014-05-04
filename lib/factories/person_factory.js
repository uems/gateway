var _ = require('underscore');


var COUNTRY_MAPPINGS = {
  Brazil: 'Brasil'
};

function fixCountry(country) {
  return COUNTRY_MAPPINGS[country] || country;
}

function isValidTicket(ticket) {
  return _.contains(['paid','approved','accepted','confirmed'], ticket.status);
}

function Person(data, source, transitions) {
  var self = data;

  self.source = source;
  self.xid    = source + '-' + self.id;
  // FIXME: un-hardcode self url
  self.uri = 'http://localhost:2000/people/'+self.xid;

  _.each(transitions, function(transformation) {
    transformation.call(null, self);
  });

  self.validTickets    = _(self.tickets).filter(isValidTicket);
  self.pendingTickets  = _(self.tickets).reject(isValidTicket);

  self.country = fixCountry(self.country);

  delete self.tickets;

  self.country = fixCountry(self.country);

  return self;
}

module.exports = {
  build: function(data, source, history) {
    return history.then(function(transitions) {
      return Person(data, source, transitions);
    });
  }
};

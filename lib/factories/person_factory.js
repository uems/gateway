var _ = require('underscore');


var COUNTRY_MAPPING = {
  Brazil: 'Brasil'
};
var GENDER_MAPPING = {
  'm': 'masculino',
  'f': 'feminio',
  'male': 'masculino',
  'female': 'feminio'
};

function fixCountry(country) {
  return COUNTRY_MAPPING[country] || country;
}
function fixGender(gender) {
  return GENDER_MAPPING[gender] || gender;
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

  self.validTickets   = _(self.tickets).filter(isValidTicket) || [];
  self.pendingTickets = _(self.tickets).reject(isValidTicket) || [];
  self.payableTicket  = null;

  self.country = fixCountry(self.country);
  self.gender  = fixGender(self.gender);

  delete self.tickets;

  self.country = fixCountry(self.country);

  self.setPayableTicket = function(ticket) {
    self.payableTicket = ticket;
  };
  self.hasValidTickets = function() {
    return self.validTickets.length > 0;
  };

  return self;
}

module.exports = {
  build: function(data, source, history) {
    return history.then(function(transitions) {
      return Person(data, source, transitions);
    });
  }
};

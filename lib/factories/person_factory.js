var _ = require('underscore');
var config = require('config');


var COUNTRY_MAPPING = {
  Brazil: 'Brasil'
};
var GENDER_MAPPING = {
  'm': 'masculino',
  'f': 'feminino',
  'male': 'masculino',
  'female': 'feminino'
};

function fixCountry(country) {
  return COUNTRY_MAPPING[country] || country;
}
function fixGender(gender) {
  return GENDER_MAPPING[gender] || gender;
}

function isValidTicket(ticket) {
  return _.contains(['paid','paid-cash','paid-proof','approved','accepted','confirmed'], ticket.status);
}

function Person(data, source, transitions) {
  var self = data;

  self.source = source;
  self.xid    = source + '-' + self.id;
  // FIXME: un-hardcode self url
  self.uri = config.app_host + '/people/' + self.xid;

  _.each(transitions, function(transformation) {
    transformation.call(null, self);
  });

  self.validTickets   = _(self.tickets).filter(isValidTicket);
  self.pendingTickets = _(self.tickets).reject(isValidTicket);
  self.payableTicket  = null;
  delete self.tickets;

  self.country = fixCountry(self.country);
  self.gender  = fixGender(self.gender);


  self.setPayableTicket = function(ticket) {
    self.payableTicket = ticket;
  };
  self.hasValidTickets = function() {
    return self.validTickets.length > 0;
  };

  return self;
}

module.exports = {
  build: function(rawPerson, source, transitions) {
    return transitions.then(function(transformList) {
      return Person(rawPerson, source, transformList);
    });
  }
};

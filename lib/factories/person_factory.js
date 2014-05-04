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
  _.extend(this, data);

  this.source = source;
  this.xid    = source + '-' + this.id;
  // FIXME: un-hardcode this url
  this.uri = 'http://localhost:2000/people/'+this.xid;

  _.each(transitions, function(transformation) {
    transformation.call(null, this);
  });

  this.validTickets    = _(this.tickets).filter(isValidTicket);
  this.pendingTickets  = _(this.tickets).reject(isValidTicket);

  this.country = fixCountry(this.country);

  delete this.tickets;

  this.country         = fixCountry(this.country);
}

module.exports = {
  build: function(data, source, history) {
    return history.then(function(transitions) {
      return new Person(data, source, transitions);
    });
  }
};

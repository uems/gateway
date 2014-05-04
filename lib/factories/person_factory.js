var _ = require('underscore');

var COUNTRY_MAPPINGS = {
  Brazil: 'Brazil'
};

function fixCountry(country) {
  return COUNTRY_MAPPINGS[country] || country;
}

function isValidTicket(ticket) {
  return _.contains(['paid','approved','accepted','confirmed'], ticket.status);
}


module.exports = {
  build: function(data, source, history) {
    return history.then(function(transitions) {
      data.source = source;
      data.xid = source + '-' + data.id;
      // FIXME: un-hardcode this url
      data.uri = 'http://localhost:3000/people/'+data.xid;
      _.each(transitions, function(transformation) {
        transformation.call(null, data);
      });

      data.validTickets   = _(data.tickets).filter(isValidTicket);
      data.pendingTickets = _(data.tickets).reject(isValidTicket);
      delete data.tickets;

      data.country        = fixCountry(COUNTRY_MAPPINGS[data.country]);
      return data;
    });
  }
};

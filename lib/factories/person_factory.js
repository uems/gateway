var _ = require('underscore');


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
      return data;
    });
  }
};

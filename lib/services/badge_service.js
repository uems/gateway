var Q = require('q');
var _ = require('underscore');

var config        = require('../config');
var connection    = require('../connection');
var personService = require('../services/person_service.js');

function BadgeService() {
  var conn = connection.build({});

  this.print = function(xid, kind, printer) {
    var endpoint = config.printers[printer];
    return personService.get(xid).then(function(person) {
      var data = {
        xid: person.xid,
        city: person.city || person.country,
        name: person.badgeName || person.badge || person.name,
        company: person.badgeCorp
      };
      var url = endpoint + "/" + kind;
      return conn.post(url, null, data);
    });
  };
}

module.exports = new BadgeService();

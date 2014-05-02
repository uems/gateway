var Q = require('q');
var _ = require('underscore');

var config        = require('../config');
var connection    = require('../connection');
var personService = require('../services/person_service.js');

function BadgeService() {
  var endpoint = config.printers['1'];
  var conn = connection.build({});

  this.print = function(xid, kind) {
    return personService.get(xid).then(function(person) {
      var data = {
        xid: person.xid,
        city: person.city || person.country,
        name: person.badge_name || person.badge || person.name,
        company: person.badge_corp
      };
      var url = endpoint + "/" + kind;
      return conn.post(url, null, data);
    });
  };
}

module.exports = new BadgeService();

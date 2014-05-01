var Q = require('q');
var _ = require('underscore');

var config        = require('../config');
var connection    = require('../connection');
var personService = require('../services/person_service.js');

function BadgeService() {
  this.print = function(xid) {
    return personService.get(xid).then(function(person) {
      var data = {
        xid: person.xid,
        city: person.city,
        name: person.badge_name,
        company: person.badge_corp
      };
      var url = config.printers['1'] + "/badge"
      return connection.post(url, null, data);
    });
  };
}

module.exports = new BadgeService();

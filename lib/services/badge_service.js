var Q = require('q');
var _ = require('underscore');

var config        = require('../config');
var connection    = require('../connection');
var personService = require('../services/person_service');
var history       = require('../repositories/history');

function BadgeService() {
  var conn = connection.build({});

  this.move = function(xid, location) {
    return history.moveBadge(xid, location);
  };

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
      return conn.post(url, null, data).then(function(result) {
        return history.print(xid, kind, printer, result);
      }).fail(function(err) {
        console.log(err);
        return history.print(xid, kind, printer, err).then(function() {
          throw err;
        });
      });
    });
  };
  this.createSingle = function(printer, reason, name, company) {
    var endpoint = config.printers[printer];
    var url = endpoint + '/badge';
    var data = {
      xid: 'Z-1',
      name: name,
      company: company,
    };
    return conn.post(url, null, data).then(function(result) {
      return history.printSingle(printer, reason, name, corp);
    }).fail(function(err) {
      console.log(err);
      throw err;
    });
  };

  this.giveBadge = function(xid) {
    return history.giveBadge(xid);
  };
}

module.exports = new BadgeService();

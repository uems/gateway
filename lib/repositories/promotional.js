var Q = require('q');
var _ = require('underscore');

var config = require('../config.js');

var connection = require('../connection');
var factory    = require('../factories/person_factory');
var history    = require('../repositories/history');

function Promotional() {
  var descriptor = _(config.repositories).findWhere({ name: 'greve' });
  var conn = connection.build({ user: descriptor.user, pass: descriptor.pass });

  this.get = function(hash) {
    var href = descriptor.endpoint + '/promo/' + hash;
    return conn.get(href).then(function(rawPromo) {
      return history.countPromocodeApplications(hash).then(function(localApplicationsCount) {
        rawPromo.usedRegs += localApplicationsCount;
        return rawPromo;
      });
    });
  };
}

module.exports = new Promotional();

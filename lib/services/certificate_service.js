var Q = require('q');
var _ = require('underscore');

var config     = require('../config');
var connection = require('../connection');

var personService = require('../services/person_service');

function certificateType(category) {
  if (category === 'speaker') {
    return 'speaker';
  }
  else {
    return 'participant';
  }
}

function languageForCountry(country) {
  return 'BR';
}

function activityTitles(tickets) {
  var titles =  _.chain(tickets)
                 .pluck('title')
                 .compact()
                 .value();
  return JSON.stringify(titles);
}

function CertificateService() {
  var conn = connection.build({
    user: config.certs.user,
    pass: config.certs.pass
  });

  this.getIssuableCertificate = function(person) {
    if (_.isEmpty(person.validTickets))       { return Q.when(null); }
    if (_.isObject(person.issuedCertificate)) { return Q.when(null); }

    var certificate = {};

    certificate.type       = certificateType(person.category);
    certificate.xid        = person.xid;
    certificate.language   = languageForCountry(person.country);
    certificate.activities = activityTitles(person.validTickets);
    certificate.name       = person.certificateName || person.name;

    return Q.when(certificate);
  };

  this.issueCertificate = function(xid) {
    var url         = config.certs.endpoint;
    var credentials = { user: config.certs.user, pass: config.certs.pass };

    return personService.get(xid).then(function(person) {
      if (!person.issuableCertificate) {
        throw { error: 'no valid certificate' };
      }
      return conn.post(url, {}, person.issuableCertificate).then(function(result) {
        console.log(result);
        return result;
//        history.issuedCertificate(xid, result.hash);
      });
    });
  };
}

module.exports = new CertificateService();

var Q = require('q');
var _ = require('underscore');

var config     = require('../config');
var connection = require('../connection');

var history = require('../repositories/history');

var personService = require('../services/person_service');

function certificateType(category) {
  if (category === 'speaker') {
    return 'speaker';
  }
  else {
    return 'participant';
  }
}

function languageForPerson(person) {
  var languages = _.chain(person.validTickets)
                   .pluck('language')
                   .uniq()
                   .value();
  if (languages.indexOf('pt') > -1) { return 'pt'; }
  else if (languages.indexOf('en') > -1) { return 'en' }

  return 'BR';
}

function activityTitles(tickets) {
  return  _.chain(tickets)
           .pluck('title')
           .compact()
           .value();
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
    certificate.language   = languageForPerson(person);
    certificate.activities = activityTitles(person.validTickets);
    certificate.name       = person.certificateName || person.name;

    return Q.when(certificate);
  };

  this.issueCertificate = function(xid) {
    var url         = config.certs.endpoint;
    var credentials = { user: config.certs.user, pass: config.certs.pass };

    return personService.get(xid).then(function(person) {
      if (!person.issuableCertificate) {
        throw { error: 'no valid certificate to be issued' };
      }
      var data = _.clone(person.issuableCertificate);
      data.activities = JSON.stringify(data.activities);

      return conn.post(url, {}, data).then(function(result) {
        return history.issuedCertificate(xid, person.issuableCertificate, result.url);
      });
    });
  };
}

module.exports = new CertificateService();

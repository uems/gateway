var Q = require('q');

var nodemailer = require("nodemailer");

var path           = require('path');
var templatesDir   = path.resolve(__dirname, '../..', 'templates');
var emailTemplates = require('email-templates');
var nodemailer     = require('nodemailer');

var config = require('../config');

function loadTemplater() {
  var deferred = Q.defer();
  emailTemplates(templatesDir, function(err, template) {
    if (err) {
      deferred.reject({ status: 500, error: err });
    }
    else {
      deferred.resolve(template);
    }
  });
  return deferred.promise;
}

function fail(status, message) {
  var deferred = Q.defer();
  deferred.reject({
    status: status,
    error: message
  });
  return deferred.promise;
}

function Mailer() {
  var smtpTransport = nodemailer.createTransport("SMTP", config.sendmail);

  var templater = loadTemplater();

  this.sendCallForCertificate = function(person) {
    if (!person.issuableCertificate) {
      return fail(400, 'no issuable certificate for this person');
    }

    if (!person.loginHash) {
      return fail(400, 'this person has no login hash');
    }

    var context = {
      afterConf: config.afterconf,
      person: person
    };
    return this.sendMail('call-for-certificate', person.email, 'certificado disponível', context);
  };

  this.sendMail = function(templateName, recipient, subject, data) {
    return templater.then(function(templater) {
      var deferred = Q.defer();

      templater(templateName, data, function(err, html, text) {
        if (err) { deferred.reject(err); }
        else {
          smtpTransport.sendMail({
            from: config.sendmail.from,
            to: recipient,
            bcc: config.sendmail.bcc,
            subject: '[fisl15]' + subject,
            html: html,
            text: text,
          }, function(err, status) {
            if (err) {
              deferred.reject({ status: 400, error: err });
            }
            else {
              deferred.resolve({ status: 200, message: status.message });
            }
          });
        }
      });

      return deferred.promise;
    });
  };
}
module.exports = new Mailer();

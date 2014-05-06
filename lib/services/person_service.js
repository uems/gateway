var Q = require('q');
var _ = require('underscore');

var config     = require('../config');

var people      = require('../repositories/people');
var history     = require('../repositories/history');
var promotional = require('../repositories/promotional');

var shallowFlatten = _.partial(_.flatten, _, true);

function PersonService() {
  var repositories = {};

  _.each(config.repositories, function(descriptor) {
    repositories[descriptor.name] = people.build(descriptor);
  });

  this.search = function(query) {
    var promises = _.chain(repositories)
                    .invoke('search', query)
                    .value();
    return Q.all(promises).then(shallowFlatten);
  };

  this.get = function(xid) {
    var parts  = xid.split(/-/);
    var source = parts[0];
    var id     = parseInt(parts[1]);

    return repositories[source].get(id);
  };

  this.setName = function(xid, name) {
    return history.setName(xid, name);
  };
  this.setEmail = function(xid, email) {
    // FIXME: check for email collisions!
    return history.setEmail(xid, email);
  };
  this.setDocument = function(xid, document) {
    // FIXME: check for document collisions!
    return history.setDocument(xid, document);
  };
  this.setBadgeName = function(xid, badgeName) {
    return history.setBadgeName(xid, badgeName);
  };
  this.setBadgeCorp = function(xid, badgeCorp) {
    return history.setBadgeCorp(xid, badgeCorp);
  };
  this.setCountry = function(xid, country) {
    return history.setCountry(xid, country);
  };
  this.setCity = function(xid, city) {
    return history.setCity(xid, city);
  };
  this.setCategory = function(xid, category) {
    return history.setCategory(xid, category);
  };
  this.setGender = function(xid, gender) {
    return history.setGender(xid, gender);
  };

  this.acceptProof = function(xid, proofFor) {
    return history.acceptProof(xid, proofFor);
  };
  this.applyPromocode = function(xid, hash) {
    return promotional.get(hash).then(function(promocode) {
      console.log("dentro do then do get promo");
      var availableRegs = promocode.maxRegs - promocode.usedRegs;
      if (availableRegs <= 0) {
        throw { err: "promotional code depleted" };
      }
      return history.applyPromocode(xid, promocode).then(function(result) {
        if (promocode.offRate == 100) {
          return history.addPromotionalTicket(xid, promocode);
        }
        return result;
      });
    });
  };

}

module.exports = new PersonService();

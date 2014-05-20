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
    repositories[descriptor.name] = people.buildExternal(descriptor);
  });
  repositories.local = people.localRepository;
  repositories.history = history;

  function uniqByXid(list) {
    return _(list).uniq(function(person) { return person.xid; });
  }

  this.search = function(query) {
    query = query.replace(/[ãâáàéêóôíúçü]/gi, '_');
    var promises = _.chain(repositories)
                    .invoke('search', query, this)
                    .value();
    return Q.all(promises)
            .then(shallowFlatten)
            .then(uniqByXid);
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
    return this.search(email).then(function(results) {
      if (results.length) {
        if (results.xid != xid) {
          throw { err: "email already in use" };
        }
      }
      return history.setEmail(xid, email);
    });
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
  this.setCertificateName = function(xid, name) {
    // TODO: must block attempts of setting a certificate name again!
    return history.setCertificateName(xid, name);
  };

  this.acceptProof = function(xid, proofFor, ip) {
    return history.acceptProof(xid, proofFor, ip);
  };
  this.acceptCash = function(xid, ticket, ip) {
    return history.acceptCash(xid, ticket, ip);
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

  this.createPerson = function(email) {
    return this.search(email).then(function(results) {
      if (results.length) {
        throw { err: "email already in use" };
      }
      return repositories.local.create(email).then(function(id) {
        return repositories.local.get(id);
      });
    });
  };

  this.listing = function() {
    var promises = _.chain(repositories)
                    .map(function(r) { return r.listing(); })
                    .value();
    return Q.all(promises).then(function(listings) {
      var categories = {};

      _(listings).each(function(listing) {
        _(listing).each(function(emails, key) {
          if (!_.has(categories, key)) {
            categories[key] = [];
          }
          categories[key] = categories[key].concat(emails);
        });
      });

      return _.chain(categories)
              .map(function(emails, category) { return [ category, emails.length ]; })
              .object()
              .value();
    });
  };
}

module.exports = new PersonService();

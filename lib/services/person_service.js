var Q = require('q');
var _ = require('underscore');

var uuid = require('node-uuid');

var config     = require('../config');

var people      = require('../repositories/people');
var history     = require('../repositories/history');
var promotional = require('../repositories/promotional');

var shallowFlatten = _.partial(_.flatten, _, true);

function PersonService() {
  var self = this;

  var repositories = {};

  _.each(config.repositories, function(descriptor) {
    repositories[descriptor.name] = people.buildExternal(descriptor);
  });
  repositories.local = people.localRepository;
  repositories.history = history;

  function uniqByXid(list) {
    return _(list).uniq(function(person) { return person.xid; });
  }

  self.search = function(query) {
    query = query.replace(/[ãâáàéêóôíúçü]/gi, '_');
    var promises = _.chain(repositories)
                    .invoke('search', query, self)
                    .value();
    return Q.all(promises)
            .then(shallowFlatten)
            .then(uniqByXid);
  };

  self.get = function(xid) {
    var parts  = xid.split(/-/);
    var source = parts[0];
    var id     = parseInt(parts[1]);

    return repositories[source].get(id);
  };

  self.setName = function(xid, name) {
    return history.setName(xid, name);
  };
  self.setEmail = function(xid, email) {
    return self.search(email).then(function(results) {
      if (results.length) {
        if (results.xid != xid) {
          throw { err: "email already in use" };
        }
      }
      return history.setEmail(xid, email);
    });
  };
  self.setDocument = function(xid, document) {
    // FIXME: check for document collisions!
    return history.setDocument(xid, document);
  };
  self.setBadgeName = function(xid, badgeName) {
    return history.setBadgeName(xid, badgeName);
  };
  self.setBadgeCorp = function(xid, badgeCorp) {
    return history.setBadgeCorp(xid, badgeCorp);
  };
  self.setCountry = function(xid, country) {
    return history.setCountry(xid, country);
  };
  self.setCity = function(xid, city) {
    return history.setCity(xid, city);
  };
  self.setCategory = function(xid, category) {
    return history.setCategory(xid, category);
  };
  self.setGender = function(xid, gender) {
    return history.setGender(xid, gender);
  };
  self.setCertificateName = function(xid, name) {
    // TODO: must block attempts of setting a certificate name again!
    return history.setCertificateName(xid, name);
  };

  self.resetLoginHash = function(xid) {
    var hash = (uuid.v4() + uuid.v4()).replace(/-/g,'');
    return history.setLoginHash(xid, hash);
  };

  self.acceptProof = function(xid, proofFor, ip) {
    return history.acceptProof(xid, proofFor, ip);
  };
  self.acceptCash = function(xid, ticket, ip) {
    return history.acceptCash(xid, ticket, ip);
  };
  self.applyPromocode = function(xid, hash) {
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

  self.createPerson = function(email) {
    return self.search(email).then(function(results) {
      if (results.length) {
        throw { err: "email already in use" };
      }
      return repositories.local.create(email).then(function(id) {
        return repositories.local.get(id);
      });
    });
  };

  self.listing = function() {
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

  self.findPersonByLoginHash = function(hash) {
    return history.getXidByLoginHash(hash).then(function(xid) {
      return self.get(xid);
    });
  };
}

module.exports = new PersonService();

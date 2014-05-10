var Q = require('q');
var _ = require('underscore');
var pmongo = require('promised-mongo');

function Transformation(data) {
  var transformations = {
    'setName': function(person) {
      person.name = data.newValue;
    },
    'setEmail': function(person) {
      person.email = data.newValue;
    },
    'setDocument': function(person) {
      person.document = data.newValue;
    },
    'setBadgeName': function(person) {
      person.badgeName = data.newValue;
    },
    'setBadgeCorp': function(person) {
      person.badgeCorp = data.newValue;
    },
    'setCountry': function(person) {
      person.country = data.newValue;
    },
    'setCity': function(person) {
      person.city = data.newValue;
    },
    'setGender': function(person) {
      person.gender = data.newValue;
    },
    'setCategory': function(person) {
      person.category = data.newValue;
    },
    'badgePrinted': function(person) {
      person.badgePrinted = data;
    },
    'badgeGiven': function(person) {
      person.badgeGiven = data.when;
    },
    'badgeMoved': function(person) {
      person.badgeMoved = data;
    },
    'acceptProof': function(person) {
      var ticket = _(person.tickets).findWhere({ id: parseInt(data.proofFor) });
      ticket.ip = data.ip;
      ticket.status = 'paid-proof';
    },
    'acceptCash': function(person) {
      if (!person.tickets) { person.tickets = []; }
      data.ticket.ip = data.ip;
      data.ticket.approval_date = data.when;
      person.tickets.push(data.ticket);
    },
    'applyPromocode': function(person) {
      person.promotionalCode = data.promotionalCode;
      person.category = 'Participante';
    },
    'addTicket': function(person) {
      if (!person.tickets) { person.tickets = []; }
      person.tickets.push(data.ticket);
    },
    'setPaid': function(person) {
      var ticket = _(person.tickets).findWhere({ id: parseInt(data.ticketId) });
      ticket.status = 'paid';
    }
  };
  return transformations[data.kind];
}

function History() {
  var db = pmongo('history', ['transitions']);

  function insert(dbname, entry) {
    entry.when = (new Date()).toISOString();
    return db[dbname].insert(entry);
  }

  this.setName = function(xid, name) {
    var entry = { xid: xid, kind: 'setName', newValue: name };
    return insert('transitions', entry);
  };
  this.setEmail = function(xid, email) {
    var entry = { xid: xid, kind: 'setEmail', newValue: email };
    return insert('transitions', entry);
  };
  this.setDocument = function(xid, document) {
    var entry = { xid: xid, kind: 'setDocument', newValue: document };
    return insert('transitions', entry);
  };
  this.setBadgeName = function(xid, badgeName) {
    var entry = { xid: xid, kind: 'setBadgeName', newValue: badgeName };
    return insert('transitions', entry);
  };
  this.setBadgeCorp = function(xid, badgeCorp) {
    var entry = { xid: xid, kind: 'setBadgeCorp', newValue: badgeCorp };
    return insert('transitions', entry);
  };
  this.setCountry = function(xid, country) {
    var entry = { xid: xid, kind: 'setCountry', newValue: country };
    return insert('transitions', entry);
  };
  this.setCity = function(xid, city) {
    var entry = { xid: xid, kind: 'setCity', newValue: city };
    return insert('transitions', entry);
  };
  this.setGender = function(xid, gender) {
    var entry = { xid: xid, kind: 'setGender', newValue: gender };
    return insert('transitions', entry);
  };
  this.setCategory = function(xid, category) {
    var entry = { xid: xid, kind: 'setCategory', newValue: category };
    return insert('transitions', entry);
  };
  this.setGender = function(xid, gender) {
    var entry = { xid: xid, kind: 'setGender', newValue: gender };
    return insert('transitions', entry);
  };
  this.giveBadge = function(xid) {
    var entry = { xid: xid, kind: 'badgeGiven' };
    return insert('transitions', entry);
  };
  this.moveBadge = function(xid, location) {
    var entry = { xid: xid, kind: 'badgeMoved', location: location };
    return insert('transitions', entry);
  };
  this.acceptProof = function(xid, proofFor, ip) {
    var entry = { xid: xid, kind: 'acceptProof', ip: ip, proofFor: proofFor };
    return insert('transitions', entry);
  };
  this.acceptCash = function(xid, ticket, ip) {
    ticket.paid = ticket.price;
    ticket.status = 'paid-cash';
    var entry = { xid: xid, kind: 'acceptCash', ip: ip, ticket: ticket };
    return insert('transitions', entry);
  };
  this.applyPromocode = function(xid, promotionalCode) {
    var entry = { xid: xid, kind: 'applyPromocode', promotionalCode: promotionalCode };
    return insert('transitions', entry);
  };
  this.addPromotionalTicket = function(xid, promocode) {
    var ticket = {
      id: promocode.id,
      method: 'promotional_code',
      status: "accepted",
      price: 0,
      paid: 0,
      grants: "Participante",
      creationDate: promocode.creationDate,
      approvalDate: new Date()
    };
    var entry = { xid: xid, kind: 'addTicket', ticket: ticket };
    return insert('transitions', entry);
  };

  this.countPromocodeApplications = function(hash) {
    return db.transitions.count({ kind: 'applyPromocode', 'promotionalCode.hash': hash });
  };

  this.print = function(xid, kind, location, result) {
    var entry = {
      xid: xid,
      kind: 'badgePrinted',
      location: location,
      result: result
    };
    return insert('transitions',entry);
  };
  this.printSingle = function(location, reason, name, corp) {
    var entry = {
      kind: 'printSingle',
      location: location,
      reason: reason,
      name: name,
      corp: corp,
    };
    return insert('transitions',entry);
  };

  this.getTransitions = function(xid) {
    return db.transitions.find({ xid: xid }).sort({ when: -1 }).toArray().then(function(transitions) {
      return _.map(transitions, Transformation);
    });
  };

  this.getCurrentTransitions = function(xid) {
    return db.transitions.find({ xid: xid }).sort({ when: -1}).toArray().then(function(transitions) {
      return _.chain(transitions)
              .groupBy('kind')
              .values()
              .pluck(0)
              .flatten()
              .map(Transformation)
              .value();
    });
  };

  this.search = function(query, personSvc) {
    var pattern = new RegExp(query);
    return db.transitions.find({ $or: [
       { kind: 'setName', newValue: pattern },
       { kind: 'setEmail', newValue: pattern },
       { kind: 'setDocument', newValue: pattern },
    ]}).toArray().then(function(transitions) {
      var promises = _.chain(transitions)
                      .pluck('xid')
                      .uniq()
                      .map(function(xid) { return personSvc.get(xid); })
                      .value();

      return Q.all(promises);
    });
  };

  this.findTicketGrantingOperations = function() {
    return db.transitions.find({ $or: [
      { kind: 'acceptCash' },
      { kind: 'acceptProof' },
      { kind: 'addPromotionalTicket' }
    ]}).toArray();
  };

  this.findAcceptCashByIp = function(ip, day) {
    var defaultYear  = 2014;
    var defaultMonth = 5;
    var size = (day)? 10:7;
    var date = (new Date(defaultYear,defaultMonth-1,day || 1)).toISOString().slice(0,size);
    console.log(date);
    return db.transitions.find({
      kind: 'acceptCash',
      ip: ip,
      when: new RegExp(date)
    }).sort({ when: 1 }).toArray();
  };

  this.listing = function() {
    var cashTickets = require('../services/cash_ticket_service');
    var personSvc   = require('../services/person_service');

    return cashTickets.allPaymentXids().then(function(xids) {
      var promises = _.chain(xids)
                      .map(personSvc.get)
                      .map(Q.promised(function(p) { return p.email; } ))
                      .value();

      return Q.all(promises).then(function(emails) {
        return { "Participante": emails };
      });
    });
  };


}


module.exports = new History();

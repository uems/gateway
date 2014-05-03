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
    }
  };
  return transformations[data.kind];
}

function History() {
  var db = pmongo('history', ['transitions']);

  this.setName = function(xid, name) {
    var entry = { xid: xid, kind: 'setName', newValue: name };
    return db.transitions.insert(entry);
  };
  this.setEmail = function(xid, email) {
    var entry = { xid: xid, kind: 'setEmail', newValue: email };
    return db.transitions.insert(entry);
  };
  this.setDocument = function(xid, document) {
    var entry = { xid: xid, kind: 'setDocument', newValue: document };
    return db.transitions.insert(entry);
  };
  this.setBadgeName = function(xid, badgeName) {
    var entry = { xid: xid, kind: 'setBadgeName', newValue: badgeName };
    return db.transitions.insert(entry);
  };
  this.setBadgeCorp = function(xid, badgeCorp) {
    var entry = { xid: xid, kind: 'setBadgeCorp', newValue: badgeCorp };
    return db.transitions.insert(entry);
  };

  this.getTransitions = function(xid) {
    return db.transitions.find({ xid: xid }).toArray().then(function(transitions) {
      return _.map(transitions, Transformation);
    });
  };
}


module.exports = new History();

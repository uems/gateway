var jwt = require('jsonwebtoken');
var Q = require('q');

var config = require('../config');

var promisedRoute = require('../promised_route');

module.exports = function(app) {
  app.post('/token/from-login', promisedRoute(function(req, res, fastError) {
    var token;
    if ((req.body.user === 'admin') && (req.body.pass === 'pass')) {
      token = jwt.sign({ admin: true }, config.secret);
      return Q.when({ token: token, grants: 'admin' });
    }
    else if ((req.body.user === 'greve-2') && (req.body.pass === 'pass')) {
      var xid = req.body.user;
      token = jwt.sign({ xid: xid }, config.secret);
      return Q.when({ token: token, grants: xid });
    }
    else {
      return fastError(400, 'Invalid credentials');
    }
  }));

  app.post('/token/from-hash', promisedRoute(function(req, res, fastError) {
    if (req.body.hash === 'xonga') {
      var token = jwt.sign({ xid: 'greve-2' }, config.secret);
      return Q.when({ token: token });
    }
    else {
      return fastError(400, 'Invalid hash');
    }
  }));
};

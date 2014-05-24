var cors       = require('cors');
var logger     = require('morgan');
var bodyParser = require('body-parser');

var config = require('./config');

function JsonUTF8(req, res, next) {
  res.header("Content-Type", "application/json; charset=utf-8");
  next();
}

function setMaxListeners(req, res, next) {
  req.setMaxListeners(200);
  next();
}

module.exports = function(app) {
  app.use(cors());
  app.use(JsonUTF8);
  app.use(bodyParser());
  app.use(setMaxListeners);
  app.use(logger({ format: 'dev' }));
};


var cors       = require('cors');
var logger     = require('morgan');
var bodyParser = require('body-parser');

function JsonUTF8(req, res, next) {
  res.header("Content-Type", "application/json; charset=utf-8");
  next();
}

function setMaxListeners(req, res, next) {
  req.setMaxListeners(200);
  next();
}


module.exports = {
  cors:            cors,
  logger:          logger,
  JsonUTF8:        JsonUTF8,
  bodyParser:      bodyParser,
  setMaxListeners: setMaxListeners
};

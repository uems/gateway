var cors = require('cors');

function JsonUTF8(req, res, next) {
  res.header("Content-Type", "application/json; charset=utf-8");
  next();
}

function setMaxListeners(req, res, next) {
  req.setMaxListeners(20);
  next();
}


module.exports = {
  cors:     cors,
  JsonUTF8: JsonUTF8,
  setMaxListeners: setMaxListeners
};

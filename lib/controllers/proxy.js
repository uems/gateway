var promisedRoute = require('../promised_route');
var connection    = require('../connection').build({});

module.exports = function(app) {
  app.get('*', promisedRoute(function(req, res) {
    var url = 'http://api.convenios.gov.br/siconv/v1/consulta' + req.path;
    return connection.get(url, req.query);
  }));
};

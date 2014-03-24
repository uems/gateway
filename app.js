app.get('/search/:q', function(req, res) {
  var services = BackendServices.allFor('people-search');

  var resultPromises = services.map(function(svc) { return svc.search(query); });

  var response = [];

  Q.allSettled(resultPromises).then(function(results) {
    // results contain [ resultsFromService1, resultsFromService2, ... ]
    results.forEach(function(result) {
      response.concat(result);
    });

    res.write(response.toJson());
  });
});

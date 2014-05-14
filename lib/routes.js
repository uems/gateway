module.exports = function(app) {
  require('./controllers/badge')(app);
  require('./controllers/people')(app);
  require('./controllers/payments')(app);
  require('./controllers/statistic')(app);
};

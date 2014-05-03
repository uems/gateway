var _ = require('underscore');

module.exports = {
  build: function(data, source, history) {
    return history.then(function(transitions) {
      data.source = source;
      data.xid = source + '-' + data.id;
      // FIXME: un-hardcode this url
      data.uri = 'http://localhost:3000/people/'+data.xid;
      _.each(transitions, function(transformation) {
        transformation.call(null, data);
      });
      return data;
    });
  }
};

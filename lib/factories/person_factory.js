module.exports = {
  build: function(data, source) {
    data.source = source;
    data.xid = source + '-' + data.id;
    // FIXME: un-hardcode this url
    data.uri = 'http://localhost:3000/people/'+data.xid;
    return data;
  }
};

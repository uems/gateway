module.exports = {
  repositories: [
    { name: 'papers', endpoint: 'http://192.168.33.80/papers_ng/api', user: 'api_user', pass: 'api_pass' },
    { name: 'greve',  endpoint: 'http://192.168.33.90/greve/api',     user: 'api_user', pass: 'api_pass' }
  ],
  printers: {
    1: 'http://192.168.33.70:7001'
  }

};

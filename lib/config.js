module.exports = {
  repositories: [
    { name: 'papers', endpoint: 'http://192.168.33.80/papers_ng/api', user: 'api_user', pass: 'api_pass', timeout: 7000 },
    { name: 'greve',  endpoint: 'http://192.168.33.90/greve/api',     user: 'api_user', pass: 'api_pass', timeout: 7000 },
  ],
  printers: {
    1: 'http://10.5.0.21:7001',
  }

};

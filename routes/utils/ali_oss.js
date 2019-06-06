const OSS = require('ali-oss');

const client = new OSS({
  region: '1',
  accessKeyId: '1',
  accessKeySecret: '1',
  bucket: '1',
});

module.exports = client;

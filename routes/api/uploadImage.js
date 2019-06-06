const keystone = require('keystone');
const fs = require('fs');
const client = require('../utils/ali_oss');

const FileData = keystone.list('FileUpload');

const EXE_ENV = process.env.NODE_ENV !== 'production' ? 't' : 'p';

module.exports = function (req, res) {
	const item = new FileData.model(); //eslint-disable-line
  // const data = req.method === 'POST' ? req.body : req.query;
  // keystone采用的老版multer来解析文件，根据req.files.file.path将文件从缓冲区复制出来

  const fileName = `${EXE_ENV}/cms_${req.files.file.name.split('.')[0]}_${
    req.files.file.originalname
  }`;
  console.log(fileName);
  const stream = fs.createReadStream(req.files.file.path);
  client
    .putStream(fileName, stream)
    .then((result) => {
      const imgurl = `https://${result.name}`;
      const sendResult = function () {
        res.send({
          image: {
            url: imgurl,
          },
        });
      };
      res.format({
        html: sendResult,
        json: sendResult,
      });
    })
    .catch((err) => {
      console.log(err);
      res.send({ error: { message: err.message } });
    });
};

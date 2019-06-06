import process from 'process';
import path from 'path';
import request from 'superagent';
import ProgressBar from 'progress';
import fs from 'fs';
import pkg from '../package.json';

const fileName = `${pkg.name}-${pkg.version}.zip`;
const file = path.join(process.cwd(), fileName);

const fileSize = fs.statSync(file).size;
const fileStream = fs.createReadStream(file);
const bar = new ProgressBar('上传部署包: :bar :percent :elapseds', {
  total: fileSize,
  width: 50,
  complete: '█',
  incomplete: '░',
});

fileStream.on('data', (chunk) => {
  bar.tick(chunk.length);
});

request.post('')
  .attach('stream', fileStream)
  .end((err, res) => {
    if (!err && res.ok) {
      process.stdout.write(`部署包上传OSS完成: ${fileName}`);
      process.exit(0);
    } else if (err) {
      process.stdout.write('error: %s', err);
    } else {
      process.stdout.write('error: %s', res.text);
    }
    process.exit(1);
  });

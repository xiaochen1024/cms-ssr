const fs = require('fs');
const path = require('path');
const OSS = require('ali-oss');
const co = require('co'); //eslint-disable-line
const chalk = require('chalk'); //eslint-disable-line
const pkg = require('../package.json');

const walkSync = (dir, filelist) => {
  const files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach((file) => {
    const absFile = path.join(dir, file);
    if (fs.statSync(absFile).isDirectory()) {
      filelist = walkSync(absFile, filelist);
    } else {
      filelist.push(absFile);
    }
  });
  return filelist;
};

function listFilesMap(sourceDir, targetDir = '') {
  const list = walkSync(sourceDir);
  const filesMap = list.reduce((fm, dir) => {
    const regex = new RegExp(`^${path.join(sourceDir, '/')}(.*)$`, 'g');
    const targetPath = dir.replace(regex, (match, p1) => path.join(targetDir, p1));
    fm[dir] = targetPath;
    return fm;
  }, {});

  return filesMap;
}

const client = new OSS({
  region: '1',
  accessKeyId: '1',
  accessKeySecret: '1',
  bucket: '1',
});

const filesMap = listFilesMap('views/.next');

console.log(chalk.blue('上传静态资源到CDN...'));
co(function* () {
  const files = Object.keys(filesMap);

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const cdnFile = path.join(pkg.cdnAliasName, filesMap[file]);
    const result = yield client.put(cdnFile, file);
    console.log(`  ${filesMap[file]} 🚚`);
  }
})
  .then((result) => {
    console.log(chalk.green('上传静态资源到CDN成功'));
    process.exit(0);
  })
  .catch((error) => {
    console.log(chal.red('上传静态资源到CDN失败'));
    process.exit(1);
  });

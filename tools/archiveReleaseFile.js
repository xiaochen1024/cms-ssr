/* eslint-disable */
const fs = require('fs');
const archiver = require('archiver');
const process = require('process');
const pkg = require('../package.json');


let output = fs.createWriteStream(`${__dirname}/../${pkg.name}-${pkg.version}.zip`);
let archive = archiver('zip');

let startTime = new Date().getTime();
console.log('正在打包部署包...');

output.on('close', function() {
	let endTime = new Date().getTime();
	let elaspedTime = (endTime - startTime) / 1000;
	let filesize = (archive.pointer() / 1000 / 1000).toFixed(2); //MB
	console.log(`打包部署包完成，包大小为：${filesize}MB，耗时：${elaspedTime}s`);
});

archive.on('error', function(err) {
	throw err;
});

archive.on('entry', function(entry) {
	if (!entry.name.match(/^node_modules/g) && entry.type === 'file') {
		console.log(`添加文件：${entry.name}`);
	}
});

let timestamp = new Date();

archive.pipe(output);

let pm2ConfigFile = `app.${process.env.NODE_ENV}.json`;
archive.file(pm2ConfigFile, { date: timestamp, name: 'app.pm2.json' });
archive.file('package.json', { date: timestamp });
archive.file('server.js', { date: timestamp });
archive.directory('views/.next', './views/.next', { date: timestamp });
archive.directory('updates', './updates', { date: timestamp });
archive.directory('routes', './routes', { date: timestamp });
archive.directory('static', './static', { date: timestamp });
archive.directory('models', './models', { date: timestamp });

//添加Node运行时依赖
require('child_process').exec('npm ls --production --parseable', function(err, stdout, stderr) {
	// if (err) throw err;
	let files = stdout.split('\n');
	files.forEach(function(f, idx) {
		let pos = f.indexOf('node_modules');
		if (pos !== -1) {
			let dir = f.substring(pos);
			console.log(`添加Node依赖：${dir}`);
			archive.directory(dir, true, { date: timestamp });
		}
	});

	archive.directory('node_modules/.bin', true, { date: timestamp });
	archive.finalize();
});

const config = require('./env-config');
const process = require('process');

const dev = process.env.NODE_ENV !== 'production';

const plugins = [
	['@babel/plugin-proposal-decorators', { legacy: true }],
	['@babel/plugin-proposal-class-properties', { loose: true }],
	['transform-define', config],
	["import", { "libraryName": "antd-mobile" }, "ant-mobile"]

]


module.exports = {
	presets: ['next/babel'],
	plugins,
};

'use strict';

const str = require('./str');

const parseArgs = arr => arr
	.map(param => param.split('='))
	.map(param => (param.length === 2)
		? param
		: param.concat([true]))
	.reduce((o, param) =>
		(o[str.toCamelCase(param[0].replace('--', ''), '-')] = param[1]) && o, {});

const log = data => {
	console.log(data);
	return data;
};

module.exports = {
	parseArgs,
	log
};

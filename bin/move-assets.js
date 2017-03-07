'use strict';

const fse = require('fs-extra');
const path = require('path');

const {str} = require('iblokz-data');

const parseArgs = arr => arr
	.map(param => param.split('='))
	.map(param => (param.length === 2)
		? param
		: param.concat([true]))
	.reduce((o, param) =>
		(o[str.toCamelCase(param[0].replace('--', ''), '-')] = param[1]) && o, {});

const args = parseArgs(process.argv.slice(2));

const recipe = {
	pre: {
		'dist/web/fonts': 'node_modules/font-awesome/fonts'
	}
};

const paths = recipe[args.recipe || 'pre'];

Object.keys(paths).forEach(
	p => {
		console.log(`Copying ${paths[p]} to ${p}`);
		fse.copySync(
			path.resolve(__dirname, '..', paths[p]),
			path.resolve(__dirname, '..', p)
		);
	}
);

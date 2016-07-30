'use strict';

const fse = require('fs-extra');
const path = require('path');

const term = require('../util/term');

const args = term.parseArgs(process.argv.slice(2));

const recipe = {
	pre: {
		'web/dist/fonts': 'node_modules/font-awesome/fonts'
	},
	post: {
		'electron/app/css': 'web/dist/css',
		'electron/app/fonts': 'web/dist/fonts',
		'electron/app/index.html': 'web/dist/index.html',
		'electron/app/util': 'util'
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

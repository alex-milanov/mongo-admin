'use strict';

const fse = require('fs-extra');
const path = require('path');

const cli = require('iblokz/common/cli');

const args = cli.parseArgs(process.argv.slice(2));

const recipe = {
	'pre': {
		'dist/web/fonts': 'node_modules/font-awesome/fonts'
	},
	'post:sass': {
		'electron/app/css': 'dist/web/css',
		'electron/app/fonts': 'dist/web/fonts'
		// 'electron/app/index.html': 'dist/web/index.html',
		// 'electron/app/js/actions': 'src/js/actions',
		// 'electron/app/js/ui': 'src/js/ui'
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

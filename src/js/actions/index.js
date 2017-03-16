'use strict';

const Rx = require('rx');
const $ = Rx.Observable;

const {obj} = require('iblokz-data');

const dbs = require('./dbs');
const collections = require('./collections');
const documents = require('./documents');

const initial = {
	selection: {
		server: 'localhost',
		port: 27017,
		db: null,
		collection: null,
		toggledRow: -1,
		filter: ''
	},
	error: null,
	doc: null,
	dbs: [],
	collections: [],
	documents: []
};

module.exports = {
	initial,
	dbs,
	collections,
	documents
};

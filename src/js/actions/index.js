'use strict';

const Rx = require('rx');
const $ = Rx.Observable;

const request = require('iblokz').adapters.request;
const obj = require('iblokz').common.obj;

module.exports = function(store) {
	const stream = new Rx.Subject();

	const dbs = require('./dbs')(store);
	const collections = require('./collections')(store);
	const documents = require('./documents')(store);

	console.log(dbs, collections, documents);

	const init = () => {
		stream.onNext(
			state => ({
				selection: {
					server: 'localhost',
					port: 27017,
					db: null,
					collection: null,
					toggledRow: -1
				},
				error: null,
				doc: null,
				dbs: [],
				collections: [],
				documents: []
			})
		);
		dbs.list();
	};

	return {
		init,
		dbs,
		collections,
		documents,
		stream: $.merge(stream, dbs.stream, collections.stream, documents.stream)
	};
};

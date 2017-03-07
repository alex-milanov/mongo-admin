'use strict';

const Rx = require('rx');
const $ = Rx.Observable;

const {obj} = require('iblokz-data');

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
					toggledRow: -1,
					filter: ''
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

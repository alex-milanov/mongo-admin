'use strict';

const Rx = require('rx');
const $ = Rx.Observable;

const request = require('iblokz').adapters.request;
const obj = require('iblokz').common.obj;

const stream = new Rx.Subject();

const getDBs = () => request
	.get('http://localhost:8080/api/dbs')
	.observe()
	.map(res => res.body)
	.subscribe(dbs => stream.onNext(
		state => Object.assign({}, state, {dbs})
	));

const init = () => {
	stream.onNext(
		state => ({
			selection: {
				server: 'localhost',
				db: null,
				collection: null
			},
			dbs: [],
			collections: [],
			documents: []
		})
	);
	getDBs();
};

const getCollections = db => request
	.get(`http://localhost:8080/api/dbs/${db}`)
	.observe()
	.map(res => res.body)
	.subscribe(collections => stream.onNext(
		state => Object.assign({}, state, {collections})
	));

const setDb = db => {
	stream.onNext(
		state => Object.assign({},
			obj.patch(state, 'selection', {db, collection: null}),
			{documents: []}
		)
	);
	getCollections(db);
};

const getDocuments = (db, collection) => request
	.get(`http://localhost:8080/api/dbs/${db}/${collection}`)
	.observe()
	.map(res => res.body)
	.subscribe(documents => stream.onNext(
		state => Object.assign({}, state, {documents})
	));

const setCollection = collection => stream.onNext(
	state => obj.patch(state, 'selection', {collection})
);

module.exports = {
	stream,
	init,
	getDBs,
	getCollections,
	setDb,
	getDocuments,
	setCollection
};

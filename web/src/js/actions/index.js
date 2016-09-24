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
				collection: null,
				toggledRow: -1
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
			obj.patch(state, 'selection', {db, collection: null, toggledRow: -1}),
			{documents: []}
		)
	);
	getCollections(db);
};

const createDb = db => stream.onNext(
	state => Object.assign({},
		obj.patch(state, 'selection', {db, collection: null, toggledRow: -1}),
		{collections: [], dbs: state.dbs.concat([db]), documents: []}
	)
);

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

const createCollection = (db, collection) => request
	.post(`http://localhost:8080/api/dbs/${db}/${collection}`)
	.observe()
	.subscribe(() => stream.onNext(
		state => Object.assign(
			{},
			obj.patch(state, 'selection', {collection, toggledRow: -1}),
			{documents: [], collections: state.collections.concat([collection])}
		)
	));

const toggleRow = index => stream.onNext(
	state => obj.patch(state, 'selection', {
		toggledRow: (state.selection.toggledRow === index)
			? -1
			: index
	})
);

module.exports = {
	stream,
	init,
	getDBs,
	getCollections,
	setDb,
	createDb,
	getDocuments,
	setCollection,
	createCollection,
	toggleRow
};

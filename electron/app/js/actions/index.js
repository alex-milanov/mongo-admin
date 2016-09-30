'use strict';

const Rx = require('rx');
const $ = Rx.Observable;

const request = require('iblokz').adapters.request;
const obj = require('iblokz').common.obj;

module.exports = function(store) {
	const stream = new Rx.Subject();

	const getDBs = () => store({path: 'dbs', resource: 'dbs'})
		.list()
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
				error: null,
				doc: null,
				dbs: [],
				collections: [],
				documents: []
			})
		);
		getDBs();
	};

	const getCollections = db => store({path: `dbs/${db}`, resource: 'collections'})
		.list()
		.subscribe(collections => stream.onNext(
			state => Object.assign({}, state, {collections, doc: null, error: null})
		));

	const setDb = db => {
		stream.onNext(
			state => Object.assign({},
				obj.patch(state, 'selection', {db, collection: null, toggledRow: -1}),
				{documents: [], doc: null, error: null}
			)
		);
		getCollections(db);
	};

	const createDb = db => stream.onNext(
		state => Object.assign({},
			obj.patch(state, 'selection', {db, collection: null, toggledRow: -1}),
			{collections: [], dbs: state.dbs.concat([db]), documents: [], doc: null, error: null}
		)
	);

	const getDocuments = (db, collection) =>
		store({path: `dbs/${db}/${collection}`, resource: 'documents'})
			.list()
			.subscribe(documents => stream.onNext(
				state => Object.assign({}, state, {documents, doc: null, error: null})
			));

	const setCollection = collection => stream.onNext(
		state => obj.patch(state, 'selection', {collection, toggledRow: -1, doc: null, error: null})
	);

	const createCollection = (db, collection) =>
		store({path: `dbs/${db}`, resource: 'collections'})
			.create({collection})
			.subscribe(() => stream.onNext(
				state => Object.assign(
					{},
					obj.patch(state, 'selection', {collection, toggledRow: -1}),
					{
						documents: [],
						collections: state.collections.concat([collection]), doc: null, error: null
					}
				)
			));

	const toggleRow = index => stream.onNext(
		state => obj.patch(state, 'selection', {
			toggledRow: (state.selection.toggledRow === index)
				? -1
				: index
		})
	);

	const create = () => stream.onNext(
		state => Object.assign({}, state, {doc: {}, error: null})
	);

	const edit = doc => stream.onNext(
		state => Object.assign({}, state, {doc, error: null})
	);

	const save = (db, collection, doc) => (doc._id !== undefined)
		// update
		?	store({path: `dbs/${db}/${collection}`, resource: 'documents'})
			.update(doc._id, doc)
			.subscribe(() => {
				stream.onNext(
					state => Object.assign({}, state, {doc: null, error: null})
				);
				getDocuments(db, collection);
			})
		// create
		:	store({path: `dbs/${db}/${collection}`, resource: 'documents'})
			.create(doc)
			.subscribe(() => {
				stream.onNext(
					state => Object.assign({}, state, {doc: null, error: null})
				);
				getDocuments(db, collection);
			});

	const cancel = () => stream.onNext(
		state => Object.assign({}, state, {doc: null, error: null})
	);

	const errorOnSave = error => stream.onNext(
		state => Object.assign({}, state, {error})
	);

	return {
		stream,
		init,
		getDBs,
		getCollections,
		setDb,
		createDb,
		getDocuments,
		setCollection,
		createCollection,
		toggleRow,
		create,
		edit,
		save,
		errorOnSave,
		cancel
	};
};

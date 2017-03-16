'use strict';

const Rx = require('rx');
const $ = Rx.Observable;

const {obj} = require('iblokz-data');
const store = require('../../util/store').init();

const list = (db, collection) =>
	store({path: `dbs/${db}/${collection}`, resource: 'documents'})
		.list()
		.map(documents => state =>
			Object.assign({}, state, {documents, doc: null, error: null})
		);

const toggle = index =>
	state => obj.patch(state, 'selection', {
		toggledDoc: (state.selection.toggledDoc === index)
			? -1
			: index
	});

const filter = filter =>
	state => obj.patch(state, 'selection', {filter});

const create = () =>
	state => Object.assign({}, state, {doc: {}, error: null});

const edit = doc =>
	state => Object.assign({}, state, {doc, error: null});

const save = (db, collection, doc) => (doc._id !== undefined)
	// update
	?	store({path: `dbs/${db}/${collection}`, resource: 'documents'})
		.update(doc._id, doc)
		.flatMap(() => list(db, collection))
	// create
	:	store({path: `dbs/${db}/${collection}`, resource: 'documents'})
		.create(doc)
		.flatMap(() => list(db, collection));

const cancel = () => state => Object.assign({}, state, {doc: null, error: null});

const saveError = error => state => Object.assign({}, state, {error});

const _delete = (db, collection, id) =>
	store({path: `dbs/${db}/${collection}`, resource: 'documents'})
		.delete(id)
		.flatMap(() => list(db, collection));

module.exports = {
	list,
	toggle,
	filter,
	create,
	edit,
	save,
	saveError,
	cancel,
	delete: _delete
};

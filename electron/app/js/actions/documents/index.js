'use strict';

const Rx = require('rx');
const $ = Rx.Observable;

const request = require('iblokz/adapters/request');
const obj = require('iblokz/common/obj');

module.exports = function(store) {
	const stream = new Rx.Subject();

	const list = (db, collection) =>
		store({path: `dbs/${db}/${collection}`, resource: 'documents'})
			.list()
			.subscribe(documents => stream.onNext(
				state => Object.assign({}, state, {documents, doc: null, error: null})
			));

	const toggle = index => stream.onNext(
		state => obj.patch(state, 'selection', {
			toggledDoc: (state.selection.toggledDoc === index)
				? -1
				: index
		})
	);

	const filter = filter => stream.onNext(
		state => obj.patch(state, 'selection', {filter})
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
				list(db, collection);
			})
		// create
		:	store({path: `dbs/${db}/${collection}`, resource: 'documents'})
			.create(doc)
			.subscribe(() => {
				stream.onNext(
					state => Object.assign({}, state, {doc: null, error: null})
				);
				list(db, collection);
			});

	const cancel = () => stream.onNext(
		state => Object.assign({}, state, {doc: null, error: null})
	);

	const saveError = error => stream.onNext(
		state => Object.assign({}, state, {error})
	);

	const _delete = (db, collection, id) =>
		store({path: `dbs/${db}/${collection}`, resource: 'documents'})
			.delete(id)
			.subscribe(() => {
				stream.onNext(
					state => Object.assign({}, state, {doc: null, error: null})
				);
				list(db, collection);
			});

	return {
		stream,
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
};

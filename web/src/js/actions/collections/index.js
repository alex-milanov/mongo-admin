'use strict';

const Rx = require('rx');
const $ = Rx.Observable;

const request = require('iblokz').adapters.request;
const obj = require('iblokz').common.obj;

module.exports = function(store) {
	const stream = new Rx.Subject();

	const list = db => store({path: `dbs/${db}`, resource: 'collections'})
		.list()
		.subscribe(collections => stream.onNext(
			state => Object.assign({}, state, {collections, doc: null, error: null})
		));

	const create = (db, collection) => (collection && collection !== '') &&
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

	const select = collection => stream.onNext(
		state => obj.patch(state, 'selection', {collection, toggledRow: -1, doc: null, error: null})
	);

	return {
		stream,
		list,
		create,
		select
	};
};

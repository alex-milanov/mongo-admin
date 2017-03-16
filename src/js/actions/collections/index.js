'use strict';

const Rx = require('rx');
const $ = Rx.Observable;

const {obj} = require('iblokz-data');
const store = require('../../util/store').init();

const list = db => store({path: `dbs/${db}`, resource: 'collections'})
	.list()
	.map(collections => state => Object.assign({},
		obj.patch(state, 'selection', {collection: null, toggledDoc: -1, filter: ''}),
		{collections, doc: null, error: null}
	));

const create = (db, collection) =>
	store({path: `dbs/${db}`, resource: 'collections'})
		.create({collection})
		.map(() => state => Object.assign(
			{},
			obj.patch(state, 'selection', {collection, toggledDoc: -1, filter: ''}),
			{
				documents: [],
				collections: state.collections.concat([collection]), doc: null, error: null
			}
		));

const select = collection =>
	state => obj.patch(state, 'selection',
		{collection, toggledDoc: -1, filter: '', doc: null, error: null}
	);

const _delete = (db, collection) => store({path: `dbs/${db}`, resource: 'collections'})
	.delete(collection)
	.flatMap(() => list());

module.exports = {
	list,
	create,
	select,
	delete: _delete
};

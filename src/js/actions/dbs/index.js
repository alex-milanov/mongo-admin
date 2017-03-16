'use strict';

const Rx = require('rx');
const $ = Rx.Observable;

const {obj} = require('iblokz-data');
const store = require('../../util/store').init();

const list = () => store({path: 'dbs', resource: 'dbs'})
	.list()
	.map(dbs => state => Object.assign({},
		obj.patch(state, 'selection', {db: null, collection: null, toggledRow: -1, filter: ''}),
		{dbs}
	));

const select = db => state => Object.assign({},
		obj.patch(state, 'selection', {db, collection: null, toggledRow: -1, filter: ''}),
		{documents: [], doc: null, error: null}
);

const create = db => state => Object.assign({},
	obj.patch(state, 'selection', {db, collection: null, toggledRow: -1, filter: ''}),
	{collections: [], dbs: state.dbs.concat([db]), documents: [], doc: null, error: null}
);

const _delete = db => store({path: 'dbs', resource: 'dbs'})
	.delete(db)
	.flatMap(() => list());

module.exports = {
	list,
	create,
	select,
	delete: _delete
};

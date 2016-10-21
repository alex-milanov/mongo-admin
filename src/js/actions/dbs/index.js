'use strict';

const Rx = require('rx');
const $ = Rx.Observable;

const request = require('iblokz').adapters.request;
const obj = require('iblokz').common.obj;

module.exports = function(store) {
	const stream = new Rx.Subject();

	const list = () => store({path: 'dbs', resource: 'dbs'})
		.list()
		.subscribe(dbs => stream.onNext(
			state => Object.assign({},
				obj.patch(state, 'selection', {db: null, collection: null, toggledRow: -1, filter: ''}),
				{dbs}
			)
		));

	const select = db => {
		stream.onNext(
			state => Object.assign({},
				obj.patch(state, 'selection', {db, collection: null, toggledRow: -1, filter: ''}),
				{documents: [], doc: null, error: null}
			)
		);
	};

	const create = db => stream.onNext(
		state => Object.assign({},
			obj.patch(state, 'selection', {db, collection: null, toggledRow: -1, filter: ''}),
			{collections: [], dbs: state.dbs.concat([db]), documents: [], doc: null, error: null}
		)
	);

	const _delete = db => store({path: 'dbs', resource: 'dbs'})
		.delete(db)
		.subscribe(() => list());

	return {
		stream,
		list,
		create,
		select,
		delete: _delete
	};
};

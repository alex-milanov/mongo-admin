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
			state => Object.assign({}, state, {dbs})
		));

	const select = db => {
		stream.onNext(
			state => Object.assign({},
				obj.patch(state, 'selection', {db, collection: null, toggledRow: -1}),
				{documents: [], doc: null, error: null}
			)
		);
	};

	const create = db => (db && db !== '') && stream.onNext(
		state => Object.assign({},
			obj.patch(state, 'selection', {db, collection: null, toggledRow: -1}),
			{collections: [], dbs: state.dbs.concat([db]), documents: [], doc: null, error: null}
		)
	);

	return {
		stream,
		list,
		create,
		select
	};
};

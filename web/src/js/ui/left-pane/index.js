'use strict';

const vex = require('vex-js');
const prompt = (message, cb) => vex.dialog.prompt({
	message,
	callback: v => v && v !== '' && cb(v)
});
const confirm = (message, onYes, onNo = () => false) => vex.dialog.confirm({
	message,
	callback: v => v ? onYes() : onNo()
});

const {
	section, h1, h2, i, select, option, ul, li, div, p,
	table, tbody, thead, tr, td, th, pre,
	form, textarea, input, button
} = require('iblokz').adapters.vdom;

module.exports = ({state, actions}) => section('#left-pane', [
	h1([
		i('.fa.fa-database'),
		' mongoAdmin '
	]),
	section('#dbs', [
		select({
			on: {change: el => actions.dbs.select(el.target.value)}
		}, [
			option({attrs: {value: ''}}, 'Select Database')
		].concat(state.dbs.map(db =>
			option({attrs: {value: db, selected: (db === state.selection.db)}}, db)
		))),
		button({
			on: {
				click: el => prompt('Enter Database Name', actions.dbs.create)
			}
		}, 'Create new Database'),
		// if a db is seleted
		(state.selection.db) ?
			button({
				on: {
					click: el => confirm(`Drop ${state.selection.db}?`,
						() => actions.dbs.delete(state.selection.db))
				}
			}, `Drop ${state.selection.db}`) : ''
	]),
	// show collections if db is selected
	(state.selection.db) ?
		section([
			h2([i('.fa.fa-list'), ' Collections']),
			ul('#collections', state.collections.map(collection =>
				li({
					on: {click: el => {
						actions.collections.select(collection);
						// actions.getDocuments(state.selection.db, collection);
					}},
					class: {
						active: (collection === state.selection.collection)
					}
				}, collection))),
			button('#create-collection', {
				on: {
					click: el =>
						prompt('Enter Collection Name', collectionName =>
							actions.collections.create(state.selection.db, collectionName))
				}
			}, 'Create new Collection'),
			// if a collection is seleted
			(state.selection.collection) ?
				button({
					on: {
						click: el => confirm(`Drop ${state.selection.collection}?`,
							() => actions.collections.delete(state.selection.db, state.selection.collection))
					}
				}, `Drop ${state.selection.collection}`) : ''
		]) : ''
]);

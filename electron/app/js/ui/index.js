'use strict';

const {
	section, h1, h2, i, select, option, ul, li,
	table, tbody, thead, tr, td, th, pre, button, div
} = require('iblokz').adapters.vdom;

const content = require('./content');

module.exports = ({state, actions}) => section('#ui', [
	section('#left-pane', [
		h1([
			i('.fa.fa-database'),
			' mongoAdmin '
		]),
		section('#db-select', {
			on: {change: el => actions.setDb(el.target.value)}
		}, [
			select([
				option({attrs: {value: ''}}, 'Select Database')
			].concat(state.dbs.map(db =>
				option({attrs: {value: db, selected: (db === state.selection.db)}}, db)
			))),
			button('#create-db', {
				on: {
					click: el => actions.createDb(prompt('Enter Database Name'))
				}
			}, 'Create new Database')
		]),
		// show collections if db is selected
		(state.selection.db) ?
			section([
				h2([i('.fa.fa-list'), ' Collections']),
				ul('#collections', state.collections.map(collection =>
					li({
						on: {click: el => {
							actions.setCollection(collection);
							actions.getDocuments(state.selection.db, collection);
						}},
						class: {
							active: (collection === state.selection.collection)
						}
					}, collection))),
				button('#create-collection', {
					on: {
						click: el =>
							actions.createCollection(state.selection.db, prompt('Enter Collection Name'))
					}
				}, 'Create new Collection')
			]) : ''
	]),
	content({state, actions})
]);

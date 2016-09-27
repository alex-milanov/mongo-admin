'use strict';

const {
	section, h1, h2, i, select, option, ul, li,
	table, tbody, thead, tr, td, th, pre, button, div
} = require('iblokz').adapters.vdom;

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
	section('#content', [
		ul('#breadcrumb', [
			li('.fa.fa-home'),
			li(state.selection.server),
			state.selection.db && li(state.selection.db) || '',
			state.selection.collection && li(state.selection.collection) || ''
		]),
		(state.selection.collection) ?
			section('#collection', [
				button('.big', 'Create new Document'),
				(state.collections.length > 0) ?
					table('#results', [
						thead([
							tr([
								th('')
							].concat(Object.keys(state.documents.reduce((m, o) => Object.assign(m, o), {})).map(
								field => th(field)
							)))
						]),
						tbody(state.documents.map((doc, index) =>
							tr({
								class: {
									toggled: (index === state.selection.toggledRow)
								}
							}, [
								td([
									button('.fa.fa-pencil.blue'),
									button('.fa.fa-trash.red'),
									button('.fa.fa-expand.green', {
										on: {click: el => actions.toggleRow(index)}
									})
								])
							].concat(Object.keys(doc).map(field =>
								td(
									(typeof doc[field] === 'string')
										? [div(doc[field])]
										: [pre(JSON.stringify(doc[field], null, 2))]
								)
							)))
						))
					]) : ''
			]) : ''
	])
]);

'use strict';

const {
	section, h1, h2, i, select, option, ul, li,
	table, tbody, thead, tr, td, th, pre
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
				option({props: {value: ''}}, 'Select Database')
			].concat(state.dbs.map(db =>
				option({props: {value: db}}, db)
			)))
		]),
		h2([
			i('.fa.fa-list'),
			' Collections'
		]),
		section((state.collections.length > 0) ?	[
			ul('#collections', state.collections.map(collection =>
				li({
					on: {click: el => {
						actions.setCollection(collection);
						actions.getDocuments(state.selection.db, collection);
					}},
					class: {
						active: (collection === state.selection.collection)
					}
				}, collection)
			))
		] : [])
	]),
	section('#content', [
		ul('#breadcrumb', [
			li(state.selection.server),
			state.selection.db && li(state.selection.db) || '',
			state.selection.collection && li(state.selection.collection) || ''
		]),
		table('#results', [
			thead([
				tr(Object.keys(state.documents.reduce((m, o) => Object.assign(m, o), {}))
					.map(field =>
						th(field)
					)
				)
			]),
			tbody(state.documents.map(doc =>
				tr(Object.keys(doc).map(field =>
					td(
						(typeof doc[field] === 'string')
							? doc[field]
							: [pre(JSON.stringify(doc[field], null, 2))]
					)
				))
			))
		])
	])
]);

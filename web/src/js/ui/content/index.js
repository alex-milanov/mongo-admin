'use strict';

const Rx = require('rx');
const $ = Rx.Observable;

const {
	section, h1, h2, i, select, option, ul, li, div, p,
	table, tbody, thead, tr, td, th, pre,
	form, textarea, input, button
} = require('iblokz').adapters.vdom;

module.exports = ({state, actions}) => section('#content', [
	ul('#breadcrumb', [
		li('.fa.fa-home'),
		li(state.selection.server),
		state.selection.db && li(state.selection.db) || '',
		state.selection.collection && li(state.selection.collection) || ''
	]),
	(state.doc !== null) ?
		form('#document', {
			on: {
				submit: ev => {
					$.start(() =>
						Object.assign({}, state.selection, {doc: JSON.parse(ev.target.elements['doc'].value)}))
						.subscribe(
							s => actions.save(s.db, s.collection, s.doc),
							err => actions.errorOnSave(err)
						);
					ev.preventDefault();
				}
			}
		}, [
			h2((typeof state.doc === 'object' && typeof state.doc._id !== 'undefined')
				? `Edit Document: ${state.doc._id}` : 'Create new Document'),
			(state.error) ? div('.error', state.error.message) : '',
			button('.green.big', {attrs: {type: 'submit'}}, 'Save'),
			button('.big', {on: {click: ev => actions.cancel()}}, 'Cancel'),
			textarea({attrs: {name: 'doc'}}, JSON.stringify(state.doc, null, 2))
		]) : '',
	(state.selection.collection) ?
		section('#collection', [
			(state.doc === null) ?
				button('.big', {
					on: {click: el => actions.create()}
				}, 'Create new Document') : '',
			(state.documents.length > 0) ?
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
								button('.fa.fa-pencil.blue', {
									on: {click: el => actions.edit(doc)}
								}),
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
]);

'use strict';

const Rx = require('rx');
const $ = Rx.Observable;

// vex code
const vex = require('vex-js');
const confirm = (message, onYes, onNo = () => false) => vex.dialog.confirm({
	message,
	callback: v => v ? onYes() : onNo()
});

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
							s => actions.documents.save(s.db, s.collection, s.doc),
							err => actions.documents.saveError(err)
						);
					ev.preventDefault();
				}
			}
		}, [
			h2((typeof state.doc === 'object' && typeof state.doc._id !== 'undefined')
				? `Edit Document: ${state.doc._id}` : 'Create new Document'),
			(state.error) ? div('.error', state.error.message) : '',
			button('.green.big', {attrs: {type: 'submit'}}, 'Save'),
			button('.big', {on: {click: ev => {
				actions.documents.cancel();
				ev.preventDefault();
			}}}, 'Cancel'),
			textarea({attrs: {name: 'doc'}}, JSON.stringify(state.doc, null, 2))
		]) : '',
	(state.selection.collection) ?
		section('#collection', [
			(state.doc === null) ?
				button('.big', {
					on: {click: el => actions.documents.create()}
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
								toggled: (index === state.selection.toggledDoc)
							}
						}, [
							td([
								button('.fa.fa-pencil.blue', {
									on: {click: el => actions.documents.edit(doc)}
								}),
								button('.fa.fa-trash.red', {
									on: {
										click: el =>
											confirm(`Confirm deletion of ${doc._id}`,
												() => actions.documents.delete(
													state.selection.db,
													state.selection.collection,
													doc._id
												)
											)
									}
								}),
								button('.fa.fa-expand.green', {
									on: {click: el => actions.documents.toggle(index)}
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

'use strict';

const Rx = require('rx');
const $ = Rx.Observable;

const ipc = require('electron').ipcRenderer;
const vdom = require('iblokz/adapters/vdom');
const store = require('iblokz/app/store');

const actions = require('./js/actions')(store.init({
	type: 'ipc',
	agent: ipc
}));

const ui = require('./js/ui');

const state$ = actions.stream
	.scan((state, change) => change(state), {})
	.distinctUntilChanged(state => state);
	// .map(state => ((console.log(state)), state));

// hooks
// on db change list collections
state$
	.distinctUntilChanged(state => state.selection && state.selection.db)
	.subscribe(state => actions.collections.list(state.selection.db));
// on collection change list documents
state$
	.distinctUntilChanged(state => state.selection && state.selection.collection)
	.subscribe(state => actions.documents.list(state.selection.db, state.selection.collection));

const ui$ = state$.map(state => ui({state, actions}));

// game loop tick
vdom.patchStream(ui$, '#ui');

window.actions = actions;

'use strict';

const Rx = require('rx');
const $ = Rx.Observable;

const vdom = require('iblokz-snabbdom-helpers');

console.log(344);

// store
const storeUtil = require('./util/store');
const storeType = (window.location.search.match(/store=([a-z]+)/i) || ['http']).pop();
console.log(storeType);
const store = storeUtil.init(Object.assign({type: storeType}, (storeType === 'ipc')
	? {agent: window.require('electron').ipcRenderer}
	: {agent: require('./util/request'), url: 'http://localhost:8080/api'}
));

const actions = require('./actions')(store);

const ui = require('./ui');

const state$ = actions.stream
	.scan((state, change) => change(state), {})
	.distinctUntilChanged(state => state);

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

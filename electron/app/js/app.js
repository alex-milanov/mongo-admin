'use strict';

const Rx = require('rx');
const $ = Rx.Observable;

const vdom = require('iblokz').adapters.vdom;
const ipc = require('electron').ipcRenderer;
const store = require('iblokz').app.store;

const actions = require('./js/actions')(store.init({
	type: 'ipc',
	agent: ipc
}));

const ui = require('./js/ui');

const state$ = actions.stream
	.scan((state, change) => change(state), {})
	.distinctUntilChanged(state => state)
	.map(state => ((console.log(state)), state));

const ui$ = state$.map(state => ui({state, actions}));

// game loop tick
vdom.patchStream(ui$, '#ui');

window.actions = actions;
